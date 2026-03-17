import React from 'react';
import { getAvailableWorkersAction } from '@/app/actions/client/view-worker-actions';
import WorkerCard from './WorkerCard';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { User } from '@/shared/types/userTypes';

// Next.js page props for server components with searchParams
interface SearchParams {
    category?: string;
    lat?: string;
    lng?: string;
    [key: string]: string | string[] | undefined;
}

export default async function WorkersPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParamsObj = await searchParams;
    // Extract query parameters
    const category = Array.isArray(searchParamsObj.category) ? searchParamsObj.category[0] : searchParamsObj.category;
    const latStr = Array.isArray(searchParamsObj.lat) ? searchParamsObj.lat[0] : searchParamsObj.lat;
    const lngStr = Array.isArray(searchParamsObj.lng) ? searchParamsObj.lng[0] : searchParamsObj.lng;

    const lat = latStr ? parseFloat(latStr) : undefined;
    const lng = lngStr ? parseFloat(lngStr) : undefined;

    // Fetch available workers
    const { success, data: workers, error } = await getAvailableWorkersAction(category, lat, lng);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header section */}
                {/* <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Find Available Professionals
                    </h1>
                </div> */}

                {/* Optional Top Filter/Search Bar mock (for future implementations) */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center mb-10 max-w-4xl mx-auto">
                    <div className="flex w-full gap-2 text-sm">
                        <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200">
                           <Search className="w-5 h-5 text-gray-400 mr-2" />
                           <input type="text" placeholder="Search by name or keyword..." className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400" />
                        </div>
                        <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200">
                           <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                           <input type="text" placeholder="Location..." className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400" />
                        </div>
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 flex items-center gap-2 rounded-lg transition-colors">
                            Search
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                {error || !success ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center max-w-2xl mx-auto flex flex-col items-center">
                        <span className="text-5xl mb-3">⚠️</span>
                        <h3 className="text-xl font-bold mb-1">Failed to Load Workers</h3>
                        <p>{error || "An unexpected error occurred."}</p>
                    </div>
                ) : !workers || workers.length === 0 ? (
                    <div className="bg-white rounded-[24px] border border-gray-200 p-16 text-center max-w-3xl mx-auto shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Briefcase className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No workers found</h3>
                        <p className="text-gray-500 mb-6">We couldn't find any available professionals matching your criteria right now.</p>
                        <button className="text-emerald-600 font-semibold hover:text-emerald-700">Clear filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {workers.map((worker: User, index: number) => (
                            <WorkerCard key={worker.userId || worker.id || index} worker={worker} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}