import React from 'react';
import { fetchOnlineWorkers } from '@/app/actions/users/user-actions';
import Image from 'next/image';
import { Star, BadgeCheck, MapPin, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default async function WorkersPage() {
  const workers = await fetchOnlineWorkers();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Available Professionals</h1>
        </div>

        {workers.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100 pb-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 mb-6">
              <Briefcase className="h-10 w-10 text-indigo-600" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">No professionals online right now</h3>
            <p className="mt-2 text-md text-gray-500 max-w-md mx-auto">
              We couldn't find any workers online at this exact moment. Please check back soon or browse our full list.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-16 w-16 relative rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-white border-2 border-indigo-50 group-hover:border-indigo-100 transition-colors">
                      {worker.profileImageUrl ? (
                        <Image
                          src={worker.profileImageUrl}
                          alt={worker.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-indigo-500 text-xl font-bold">
                          {worker.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-lg font-bold text-gray-900 truncate flex items-center">
                        {worker.name}
                        {worker.isVerified === 'VERIFIED' && (
                          <BadgeCheck className="w-5 h-5 text-blue-500 ml-1.5 flex-shrink-0" />
                        )}
                      </p>
                      <p className="text-sm font-medium text-indigo-600 truncate mt-0.5">
                        {worker.skills && worker.skills.length > 0 ? worker.skills[0] : 'Professional Worker'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="h-4 w-4 mr-2 text-amber-400 fill-amber-400" />
                      <span className="font-medium text-gray-700">
                        {worker.rating ? worker.rating.toFixed(1) : 'New'}
                      </span>
                      <span className="mx-1">•</span>
                      <span>{worker.totalRatings || 0} reviews</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="truncate">
                        {worker.address && worker.address.length > 0
                          ? `${worker.address[0].city || worker.address[0].street}`
                          : 'Location not specified'}
                      </span>
                    </div>
                  </div>

                  {worker.skills && worker.skills.length > 1 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {worker.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {skill}
                        </span>
                      ))}
                      {worker.skills.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-500">
                          +{worker.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50/80 px-6 py-4 border-t border-gray-100 group-hover:bg-indigo-50/50 transition-colors">
                  <Link href={`/client/workers/${worker.id}`} className="flex justify-center items-center w-full text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                    View Full Profile
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