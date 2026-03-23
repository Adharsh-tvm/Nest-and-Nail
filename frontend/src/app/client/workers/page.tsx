import React, { Suspense } from 'react';
import { getAvailableWorkersAction } from '@/app/actions/client/view-worker-actions';
import { getAllCategoriesAction } from '@/app/actions/admin/category-actions';
import WorkerCard from './WorkerCard';
import WorkerSidebar from './WorkerSidebar';
import WorkerSearchBar from './WorkerSearchBar';
import { Briefcase } from 'lucide-react';
import { User } from '@/shared/types/userTypes';
import { Category } from '@/shared/types/categoryTypes';

interface SearchParams {
    category?: string;
    lat?: string;
    lng?: string;
    search?: string;
    isOnline?: string;
    [key: string]: string | string[] | undefined;
}

export default async function WorkersPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const sp = await searchParams;

    // Parse each param safely
    const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
    const category = pick(sp.category);
    const lat = sp.lat ? parseFloat(pick(sp.lat)!) : undefined;
    const lng = sp.lng ? parseFloat(pick(sp.lng)!) : undefined;
    const search = pick(sp.search);
    const isOnline = pick(sp.isOnline) === 'true' ? true : undefined;

    // Fetch workers + categories in parallel
    const [workersResult, categoriesResult] = await Promise.all([
        getAvailableWorkersAction(category, lat, lng, search, isOnline),
        getAllCategoriesAction(),
    ]);

    const { success, data: workers, error } = workersResult;
    const categories: Category[] = categoriesResult.success && 'payload' in categoriesResult
        ? (categoriesResult.payload || []).filter((c: Category) => c.isActive)
        : [];

    const activeFiltersCount = [category, lat, isOnline].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-5">

                {/* ── Top Search Bar ── */}
                <Suspense fallback={<div className="h-14 bg-white rounded-2xl animate-pulse border border-gray-100" />}>
                    <WorkerSearchBar />
                </Suspense>

                {/* ── Main Layout: Sidebar + Content ── */}
                <div className="flex flex-col lg:flex-row gap-5 items-start">

                    {/* Left Sidebar */}
                    <div className="w-full lg:w-64 shrink-0 sticky top-5">
                        <Suspense fallback={<div className="h-96 bg-white rounded-2xl animate-pulse border border-gray-100" />}>
                            <WorkerSidebar categories={categories} activeCategory={category} />
                        </Suspense>
                    </div>

                    {/* Right Content: Results */}
                    <div className="flex-1 flex flex-col gap-4">

                        {/* Result count / active filter summary */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                {success && workers
                                    ? <><span className="font-semibold text-gray-800">{workers.length}</span> worker{workers.length !== 1 ? 's' : ''} found</>
                                    : 'Loading...'}
                            </p>
                            {activeFiltersCount > 0 && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">
                                    {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                                </span>
                            )}
                        </div>

                        {/* Error state */}
                        {(error || !success) && (
                            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center flex flex-col items-center gap-2">
                                <span className="text-4xl">⚠️</span>
                                <h3 className="font-bold">Failed to load workers</h3>
                                <p className="text-sm">{error || 'An unexpected error occurred.'}</p>
                            </div>
                        )}

                        {/* Empty state */}
                        {success && workers?.length === 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center flex flex-col items-center gap-4 shadow-sm">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                    <Briefcase className="w-8 h-8 text-gray-300" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-700">No workers found</h3>
                                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search term</p>
                                </div>
                            </div>
                        )}

                        {/* Worker Cards Grid */}
                        {success && workers && workers.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {workers.map((worker: User, index: number) => (
                                    <WorkerCard key={worker.userId || worker.id || index} worker={worker} index={index} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}