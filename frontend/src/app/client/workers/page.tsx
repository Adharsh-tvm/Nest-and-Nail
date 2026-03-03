import React from 'react';
import { fetchOnlineWorkers, getCurrentUser } from '@/app/actions/users/user-actions';
import Image from 'next/image';
import { Star, MapPin, Search, Filter, CheckCircle2, XCircle, ChevronRight, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
        <div className="mb-6 max-w-2xl flex flex-col items-start">

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-2">
            Find the right <span className="text-[#059669]">professional</span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-800 text-sm font-semibold mb">
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
              placeholder='Search by name or skill (e.g., "Wiring")...'
              className="w-full bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 py-1.5"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto px-3 md:px-0 md:pr-1.5 border-t md:border-t-0 md:border-l border-gray-100 pt-2 md:pt-0">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 text-sm font-medium hover:bg-gray-50 rounded-lg whitespace-nowrap">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              All Roles
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
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white rounded-[24px] border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col relative"
              >
                {/* Optional Top Rated Badge - Simulating for first few based on rating */}
                {worker.rating && worker.rating >= 4.5 && (
                  <div className="absolute top-0 right-4 bg-[#FF3366] text-white text-[10px] font-bold px-3 py-1 rounded-b-lg uppercase tracking-wider">
                    Top Rated
                  </div>
                )}

                <div className="p-6 flex-grow">
                  {/* Header Row */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm">
                        {worker.profileImageUrl ? (
                          <Image
                            src={worker.profileImageUrl}
                            alt={worker.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold text-gray-400">
                            {worker.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${worker.isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#111827]">{worker.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-0.5">
                        <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                        <span className="truncate max-w-[150px]">
                          {worker.skills && worker.skills.length > 0 ? worker.skills[0] : 'Professional Worker'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating & Rate Row */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                      <span className="font-bold text-sm text-gray-900">{worker.rating ? worker.rating.toFixed(1) : 'New'}</span>
                      <span className="text-xs text-gray-400">({worker.totalRatings || 0}) ratings </span> 
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-500 mb-5">
                    <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                    <span className="truncate">
                      {worker.address && worker.address.length > 0
                        ? `${worker.address[0].city || worker.address[0].street}, ${worker.address[0].state || ''}`
                        : 'Location hidden'}
                    </span>
                  </div>

                  {/* Skills Badges */}
                  <div className="flex flex-wrap gap-2">
                    {worker.skills?.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-md shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {worker.skills && worker.skills.length > 3 && (
                      <span className="px-2.5 py-1 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 rounded-md">
                        +{worker.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-[#FCFCFD] flex justify-between items-center rounded-b-[24px]">
                  {worker.isOnline ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Available
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-100">
                      <XCircle className="w-3.5 h-3.5" />
                      Busy
                    </div>
                  )}

                  <Link
                    href={`/client/workers/${worker.id}`}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}