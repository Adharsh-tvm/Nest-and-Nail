"use client";

import React from 'react';
import { User } from '@/shared/types/userTypes';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle2, XCircle, ChevronRight, Briefcase } from 'lucide-react';

interface WorkerCardProps {
    worker: User;
    index: number;
}

export default function WorkerCard({ worker, index }: WorkerCardProps) {

    console.log("Worker :",worker)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[24px] border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col relative h-full"
        >
            {/* Optional Top Rated Badge */}
            {!!worker.rating && worker.rating >= 4.5 && (
                <div className="absolute top-0 right-4 bg-[#FF3366] text-white text-[10px] font-bold px-3 py-1 rounded-b-lg uppercase tracking-wider z-10 w-auto">
                    Top Rated
                </div>
            )}

            <div className="p-6 flex-grow">
                {/* Header Row */}
                <div className="flex items-center gap-4 mb-5">
                    <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm">
                            {(worker.profileImageUrl || worker.profilePictureUrl) ? (
                                <img
                                    src={(() => {
                                        const url = worker.profileImageUrl || worker.profilePictureUrl;
                                        if (!url) return '';
                                        if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
                                            return url;
                                        }
                                        // If the backend returns raw S3 keys without presigning (e.g., 'users/profile/123.jpg')
                                        // Fallback to directly fetching from bucket without signature if public, 
                                        // Otherwise we must fetch it from our backend / API proxy.
                                        // Based on the logs, S3 bucket structure is: https://nestnail-storage-2026.s3.ap-south-1.amazonaws.com/
                                        if (!url.startsWith('/')) {
                                            return `https://nestnail-storage-2026.s3.ap-south-1.amazonaws.com/${url}`;
                                        }
                                        
                                        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                                        return `${baseUrl}/${url.replace(/^\//, '')}`;
                                    })()}
                                    alt={worker.name}
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                        // Fallback if image fails to load
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                            ) : (
                                <span className="text-xl font-bold text-gray-400">
                                    {worker.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                            <span className={`w-full h-full flex items-center justify-center text-xl font-bold text-gray-400 bg-gray-100 ${(worker.profileImageUrl || worker.profilePictureUrl) ? 'hidden' : ''}`}>
                                {worker.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${worker.isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-[#111827]">{worker.name}</h3>
                        <div className="flex flex-col gap-1.5 mt-0.5">
                            <div className="flex items-center text-sm text-gray-500">
                                <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                                <span className="truncate max-w-[150px] font-medium text-gray-700">
                                    {worker.categories && worker.categories.length > 0 ? worker.categories[0] : (worker.skills && worker.skills.length > 0 ? worker.skills[0] : 'Professional Worker')}
                                </span>
                            </div>
                            {worker.distance !== undefined && (
                                <div className="flex items-center">
                                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 flex items-center">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {worker.distance < 1000 
                                            ? `${Math.round(worker.distance)} m away`
                                            : `${(worker.distance / 1000).toFixed(1)} km away`}
                                    </span>
                                </div>
                            )}
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
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                        <span className="truncate">
                            {worker.address && worker.address.length > 0
                                ? `${worker.address[0].city || worker.address[0].street}, ${worker.address[0].state || ''}`
                                : 'Location hidden'}
                        </span>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {worker.categories?.slice(0, 2).map((category, idx) => (
                        <span
                            key={`cat-${idx}`}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md shadow-sm uppercase tracking-wider"
                        >
                            {category}
                        </span>
                    ))}
                    {worker.categories && worker.categories.length > 2 && (
                        <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-600 bg-emerald-50/50 border border-emerald-100 rounded-md">
                            +{worker.categories.length - 2}
                        </span>
                    )}
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
                        Offline
                    </div>
                )}

                <Link
                    href={`/client/workers/${worker.userId || worker.id}`}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
                >
                    <ChevronRight className="w-4 h-4 hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
