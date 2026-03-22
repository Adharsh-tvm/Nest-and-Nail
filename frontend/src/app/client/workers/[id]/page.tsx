import React from 'react';
import { getWorkerDetailAction } from '@/app/actions/client/view-worker-actions';
import { MapPin, Star, Briefcase, CheckCircle2, XCircle, ChevronLeft, Phone } from 'lucide-react';
import Link from 'next/link';

export default async function WorkerDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const paramsObj = await params;
    const { success, data: worker, error } = await getWorkerDetailAction(paramsObj.id);

    if (error || !success || !worker) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Worker Not Found</h2>
                    <p className="text-gray-500 mb-6">{error || "The worker profile you're looking for doesn't exist or is unavailable."}</p>
                    <Link href="/client/workers" className="text-emerald-600 font-semibold hover:text-emerald-700 underline">
                        Back to available workers
                    </Link>
                </div>
            </div>
        );
    }

    const initials = worker.name.substring(0, 2).toUpperCase();
    const primaryRole = worker.categories && worker.categories.length > 0 
        ? worker.categories[0] 
        : (worker.skills && worker.skills.length > 0 ? worker.skills[0] : 'Professional Worker');

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Back Link */}
                <Link href="/client/workers" className="inline-flex items-center text-gray-500 hover:text-emerald-600 transition-colors mb-6 font-medium">
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back to workers
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Profile Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm relative pt-10 px-6 pb-6 text-center text-black">
                            {/* Online Status Badge */}
                            <div className="absolute top-4 right-4">
                                {worker.isOnline ? (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 shadow-sm">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        Online
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-bold border border-gray-200 shadow-sm">
                                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                        Offline
                                    </span>
                                )}
                            </div>

                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg mb-4">
                                {(worker.profileImageUrl || worker.profilePictureUrl) ? (
                                    <img
                                        src={(() => {
                                            const url = worker.profileImageUrl || worker.profilePictureUrl;
                                            if (!url) return '';
                                            if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
                                                return url;
                                            }
                                            // Fallback for S3 raw keys
                                            if (!url.startsWith('/')) {
                                                return `https://nestnail-storage-2026.s3.ap-south-1.amazonaws.com/${url}`;
                                            }
                                            
                                            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                                            return `${baseUrl}/${url.replace(/^\//, '')}`;
                                        })()}
                                        alt={worker.name}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-4xl font-extrabold text-gray-300 tracking-wider">
                                        {initials}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl font-black text-gray-900 mb-1">{worker.name}</h1>
                            <div className="flex items-center justify-center text-[#111827] mb-2">
                                <Briefcase className="w-4 h-4 mr-1.5 text-gray-400" />
                                <span className="font-semibold text-gray-700 tracking-tight">{primaryRole}</span>
                            </div>

                            {worker.distance !== undefined && (
                                <div className="flex items-center justify-center text-sm mb-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-md font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                                        <MapPin className="w-4 h-4 mr-1.5" />
                                        {worker.distance < 1000 
                                            ? `${Math.round(worker.distance)} m away`
                                            : `${(worker.distance / 1000).toFixed(1)} km away`}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-center gap-2 mb-6">
                                <Star className="w-5 h-5 fill-emerald-500 text-emerald-500" />
                                <span className="text-xl font-bold text-gray-900">{worker.rating ? worker.rating.toFixed(1) : 'New'}</span>
                                <span className="text-sm font-medium text-gray-400">({worker.totalRatings || 0} reviews)</span>
                            </div>

                            <Link href={`/client/workers/${paramsObj.id}/book`} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
                                Book a Service
                            </Link>
                        </div>

                        {/* Contact & Info Card */}
                        <div className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Contact & Location</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-0.5">Service Area</p>
                                        <p className="text-gray-900 font-medium">
                                            {worker.address && worker.address.length > 0
                                                ? `${worker.address[0].street ? worker.address[0].street + ', ' : ''}${worker.address[0].city}, ${worker.address[0].state || ''} ${worker.address[0].zip || ''}`
                                                : 'Location details hidden'}
                                        </p>
                                    </div>
                                </div>
                                
                                {worker.phone_number && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-emerald-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-0.5">Phone (Verified)</p>
                                            <p className="text-gray-900 font-medium">{worker.phone_number}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-0.5">Verification</p>
                                        <p className="text-gray-900 font-medium capitalize">{worker.isVerified.toLowerCase()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Detailed Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Expertise & Skills */}
                        <div className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                                Expertise & Skills
                            </h2>

                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Service Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {worker.categories && worker.categories.length > 0 ? (
                                        worker.categories.map((cat, idx) => (
                                            <span key={`cat-${idx}`} className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-lg border border-emerald-100">
                                                {cat}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic">No specific categories listed.</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Specialized Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {worker.skills && worker.skills.length > 0 ? (
                                        worker.skills.map((skill, idx) => (
                                            <span key={`skill-${idx}`} className="px-4 py-2 bg-gray-50 text-gray-700 font-semibold text-sm rounded-lg border border-gray-200">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic">No specific skills listed.</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Work Photos Portfolio (if available) */}
                        {worker.workPhotos && worker.workPhotos.length > 0 && (
                            <div className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
                                <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                                    Work Portfolio
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {worker.workPhotos.map((photo, idx) => (
                                        <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative group">
                                            <img
                                                src={
                                                    photo.startsWith('http') || photo.startsWith('blob:') || photo.startsWith('data:')
                                                        ? photo
                                                        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${photo.startsWith('/') ? photo.slice(1) : photo}`
                                                }
                                                alt={`Work example ${idx + 1}`}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Member since & Activity */}
                        <div className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm flex items-center justify-between text-sm">
                            <div className="text-gray-500">
                                Member since <span className="font-bold text-gray-900">{worker.createdAt ? new Date(worker.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'}</span>
                            </div>
                            <div className="text-gray-500">
                                Weekly Jobs: <span className="font-bold text-emerald-600">{worker.weeklyJobCount || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}