import React from 'react';
import { fetchOnlineWorkers, getCurrentUser } from '@/app/actions/users/user-actions';
import { Search, Filter, Star } from 'lucide-react';
import { redirect } from 'next/navigation';
import WorkerCard from './WorkerCard';

export default async function WorkersPage() {
  const currentUser = await getCurrentUser();

  if (currentUser?.role === 'worker') {
    redirect('/worker');
  }

  const workers = await fetchOnlineWorkers();

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header Section */}
        <div className="mb-8 max-w-2xl flex flex-col items-start gap-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight flex flex-col items-start gap-4">
            <span>Find the right <span className="text-[#059669]">professional</span></span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-800 text-sm font-semibold">
              <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              Top 1% Industry Experts
            </div>
          </h1>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-1 mb-6 shadow-sm flex flex-col md:flex-row items-center gap-2">
          <div className="flex-1 flex items-center px-4 py-1 w-full">
            <Search className="w-4 h-4 text-gray-400 mr-2.5" />
            <input
              type="text"
              placeholder='Search by name, category, or skill (e.g., "Electrician")...'
              className="w-full bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 py-1.5"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto px-3 md:px-0 md:pr-1.5 border-t md:border-t-0 md:border-l border-gray-100 pt-2 md:pt-0">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 text-sm font-medium hover:bg-gray-50 rounded-lg whitespace-nowrap">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              All Categories
            </button>
            <div className="flex items-center bg-gray-50 rounded-lg p-0.5 ml-auto md:ml-3">
              <button className="px-3 py-1 bg-[#1C1917] text-white text-xs font-medium rounded-md shadow-sm">
                All
              </button>
              <button className="px-3 py-1 text-gray-600 hover:text-gray-900 text-xs font-medium rounded-md">
                Available
              </button>
              <button className="px-3 py-1 text-gray-600 hover:text-gray-900 text-xs font-medium rounded-md">
                Busy
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 font-medium">
            Showing <span className="font-bold text-gray-900">{workers.length}</span> professionals
          </p>
        </div>

        {/* Workers Grid */}
        {workers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No professionals found</h3>
            <p className="text-gray-500 text-center max-w-sm">
              We couldn't find any workers matching your criteria right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker, index) => (
              <WorkerCard key={worker.id} worker={worker} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}