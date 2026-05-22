"use client";

import React from 'react';
import { User } from '@/shared/types/userTypes';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, ChevronRight, Briefcase } from 'lucide-react';

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
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:premium-shadow transition-all duration-500 flex flex-col relative h-full animate-fade-in"
        >
            {/* Premium Badge */}
            {!!worker.rating && worker.rating >= 4.5 && (
                <div className="absolute top-4 left-4 bg-primary text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest z-10 shadow-lg shadow-primary/20 flex items-center gap-1.5">
                    <Star size={10} className="fill-white" /> Top Professional
                </div>
            )}

            <div className="p-6 flex-grow">
                {/* Header Row */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-gray-50 flex items-center justify-center border-4 border-white shadow-md group-hover:rotate-3 transition-transform duration-500">
                            {(worker.profileImageUrl || worker.profilePictureUrl) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={(() => {
                                        const url = worker.profileImageUrl || worker.profilePictureUrl;
                                        if (!url) return '';
                                        if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
                                        if (!url.startsWith('/')) return `https://nestnail-storage-2026.s3.ap-south-1.amazonaws.com/${url}`;
                                        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                                        return `${baseUrl}/${url.replace(/^\//, '')}`;
                                    })()}
                                    alt={worker.name}
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                            ) : (
                                <span className="text-3xl font-bold text-gray-300">
                                    {worker.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                            <span className={`w-full h-full flex items-center justify-center text-3xl font-bold text-gray-300 bg-gray-50 ${(worker.profileImageUrl || worker.profilePictureUrl) ? 'hidden' : ''}`}>
                                {worker.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${worker.isOnline ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                           <div className={`w-2 h-2 rounded-full bg-white ${worker.isOnline ? 'animate-pulse' : ''}`} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">{worker.name}</h3>
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                                <span className="truncate max-w-[180px]">
                                    {worker.categories && worker.categories.length > 0 ? worker.categories[0] : (worker.skills && worker.skills.length > 0 ? worker.skills[0] : 'Professional Worker')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Badges */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                        <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                        <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Rating</span>
                            <span className="text-xs font-bold text-gray-900 leading-none">{worker.rating ? worker.rating.toFixed(1) : 'New'} <span className="text-gray-400 font-medium">({worker.totalRatings || 0})</span></span>
                        </div>
                    </div>
                    {worker.distance !== undefined && (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                            <MapPin className="w-4 h-4 text-primary" />
                            <div>
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Distance</span>
                                <span className="text-xs font-bold text-gray-900 leading-none">{worker.distance < 1000 ? `${Math.round(worker.distance)}m` : `${(worker.distance / 1000).toFixed(1)}km`}</span>
                            </div>
                        </div>
                    )}
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
            <div className="px-6 py-5 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center">
                <Link
                    href={`/client/workers/${worker.userId || worker.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-100 text-gray-900 py-3 rounded-2xl text-xs font-bold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
                >
                    View Profile <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </motion.div>
    );
}
