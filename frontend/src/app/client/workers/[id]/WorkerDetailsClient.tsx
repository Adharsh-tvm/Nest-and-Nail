"use client";

import React from 'react';
import { User } from '@/shared/types/userTypes';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Star, MapPin, CheckCircle2, XCircle, ArrowLeft, Briefcase, Mail, Phone, FileText, Image as ImageIcon, Sparkles, Navigation } from 'lucide-react';
import Link from 'next/link';

interface WorkerDetailsClientProps {
    worker: User;
}

export default function WorkerDetailsClient({ worker }: WorkerDetailsClientProps) {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
    };

    const badgeVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120, damping: 12 } }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans pb-20 selection:bg-emerald-200">

            {/* Dynamic Hero Banner */}
            <div className="relative h-[180px] w-full overflow-hidden">
                {/* Banner Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900" />

                {/* Decorative blobs */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-40" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-40" />

                {/* Navigation Over Banner */}
                <div className="absolute top-0 left-0 right-0 z-10">
                    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
                        <Link href="/client/workers" className="inline-flex items-center text-sm font-semibold text-white/80 hover:text-white backdrop-blur-md bg-white/10 px-5 py-2.5 rounded-full border border-white/20 transition-all hover:bg-white/20 hover:scale-105 shadow-lg">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Directory
                        </Link>
                    </div>
                </div>
            </div>

            <motion.div
                className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* Left Column: Profile Card */}
                    <motion.div variants={itemVariants} className="xl:col-span-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-6 border border-white shadow-2xl shadow-emerald-900/5 sticky top-8 flex flex-col items-center text-center">

                            <motion.div
                                className="relative mb-5 -mt-16 group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-white flex items-center justify-center border-[6px] border-white shadow-2xl relative z-10">
                                    {worker.profileImageUrl ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={
                                                    worker.profileImageUrl.startsWith('http') || worker.profileImageUrl.startsWith('blob:') || worker.profileImageUrl.startsWith('data:')
                                                        ? worker.profileImageUrl
                                                        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${worker.profileImageUrl.startsWith('/') ? worker.profileImageUrl.slice(1) : worker.profileImageUrl}`
                                                }
                                                alt={worker.name}
                                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                            <span className="hidden absolute inset-0 flex items-center justify-center text-5xl font-extrabold text-gray-300 bg-white">
                                                {worker.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-5xl font-extrabold text-gray-300">
                                            {worker.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                {/* Glow behind image */}
                                <div className="absolute inset-0 rounded-full bg-emerald-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-[3px] border-white z-20 shadow-lg ${worker.isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                >
                                    {worker.isOnline && (
                                        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                                    )}
                                </motion.div>
                            </motion.div>

                            <h1 className="text-2xl font-bold text-gray-900 mb-1.5 tracking-tight">{worker.name}</h1>

                            <div className="flex items-center text-emerald-700 font-medium justify-center mb-5 text-[13px] bg-emerald-50/50 border border-emerald-100 px-3 py-1 rounded-full shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                                {worker.categories && worker.categories.length > 0 ? worker.categories[0] : (worker.skills && worker.skills.length > 0 ? worker.skills[0] : 'Professional Specialist')}
                            </div>

                            {/* Status Badge */}
                            <div className="mb-6 w-full">
                                {worker.isOnline ? (
                                    <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/30">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Available for New Projects
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-slate-100 to-gray-200 text-gray-600 rounded-xl text-sm font-bold border border-gray-300 shadow-sm">
                                        <XCircle className="w-4 h-4" />
                                        Currently Unavailable
                                    </div>
                                )}
                            </div>

                            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>

                            {/* Quick Info Grid */}
                            <div className="w-full grid grid-cols-2 gap-3 text-left">
                                <motion.div whileHover={{ y: -2 }} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Rating
                                    </div>
                                    <div className="font-extrabold text-gray-900 text-lg flex items-baseline gap-1">
                                        {worker.rating ? worker.rating.toFixed(1) : 'New'}
                                        <span className="text-[10px] font-semibold text-gray-400">({worker.totalRatings || 0})</span>
                                    </div>
                                </motion.div>

                                <motion.div whileHover={{ y: -2 }} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                        <MapPin className="w-3 h-3 text-blue-400" /> Location
                                    </div>
                                    <div className="font-extrabold text-gray-900 text-sm truncate pt-0.5">
                                        {worker.address && worker.address.length > 0
                                            ? worker.address[0].city || worker.address[0].street || 'Remote'
                                            : 'Remote'}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Contact Actions */}
                            <div className="w-full mt-6 space-y-2.5">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-[#0F172A] text-white py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2"
                                >
                                    Book Services Direct
                                    <Navigation className="w-4 h-4 ml-1 opacity-70" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-white text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 border-2 border-slate-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    Send Message
                                </motion.button>
                            </div>

                        </div>
                    </motion.div>

                    {/* Right Column: Details */}
                    <motion.div variants={itemVariants} className="xl:col-span-8 space-y-5 mt-6 xl:mt-0">

                        {/* Contact Details */}
                        <motion.div variants={itemVariants} className="bg-white rounded-[1.5rem] p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150"></div>

                            <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                                    <Phone className="w-5 h-5" />
                                </span>
                                Contact Information
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                                <div className="flex items-start gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="pt-1 overflow-hidden">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email Address</div>
                                        <div className="text-gray-900 font-bold text-base truncate">{worker.email || 'Hidden'}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="pt-1 overflow-hidden">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone Number</div>
                                        <div className="text-gray-900 font-bold text-base truncate">{worker.phone_number || 'Hidden'}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Categories */}
                        <motion.div variants={itemVariants} className="bg-white rounded-[1.5rem] p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150"></div>

                            <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                                    <Sparkles className="w-5 h-5" />
                                </span>
                                Service Categories
                            </h2>

                            {worker.categories && worker.categories.length > 0 ? (
                                <div className="flex flex-wrap gap-2.5 relative z-10">
                                    {worker.categories.map((category, idx) => (
                                        <motion.span
                                            variants={badgeVariants}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            key={idx}
                                            className="px-4 py-2 text-xs font-extrabold text-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg transition-all shadow-sm hover:shadow-md cursor-default uppercase tracking-wide"
                                        >
                                            {category}
                                        </motion.span>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-400 italic font-medium p-4 bg-gray-50 rounded-xl text-center border border-dashed border-gray-200">
                                    No specific categories listed yet.
                                </div>
                            )}
                        </motion.div>

                        {/* Skills */}
                        <motion.div variants={itemVariants} className="bg-white rounded-[1.5rem] p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150"></div>

                            <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
                                    <Briefcase className="w-5 h-5" />
                                </span>
                                Expertise & Skills
                            </h2>

                            {worker.skills && worker.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2.5 relative z-10">
                                    {worker.skills.map((skill, idx) => (
                                        <motion.span
                                            variants={badgeVariants}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            key={idx}
                                            className="px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100/50 rounded-lg transition-colors shadow-sm cursor-default"
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-400 italic font-medium p-4 bg-gray-50 rounded-xl text-center border border-dashed border-gray-200">
                                    No specific skills listed yet.
                                </div>
                            )}
                        </motion.div>

                        {/* Work Photos (if any) */}
                        {worker.workPhotos && worker.workPhotos.length > 0 && (
                            <motion.div variants={itemVariants} className="bg-white rounded-[1.5rem] p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-64 h-64 bg-pink-50/50 rounded-full blur-3xl -ml-32 -mt-32 transition-transform duration-700 group-hover:scale-150"></div>

                                <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10 flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shadow-inner">
                                        <ImageIcon className="w-5 h-5" />
                                    </span>
                                    Work Portfolio Gallery
                                </h2>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
                                    {worker.workPhotos.map((photo, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.03 }}
                                            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-white shadow-md cursor-pointer group/img"
                                        >
                                            <img
                                                src={
                                                    photo.startsWith('http') || photo.startsWith('blob:') || photo.startsWith('data:')
                                                        ? photo
                                                        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${photo.startsWith('/') ? photo.slice(1) : photo}`
                                                }
                                                alt={`Work photo ${idx + 1}`}
                                                className="object-cover w-full h-full transition-transform duration-700 group-hover/img:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-300"></div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Documents / Certificates */}
                        {worker.certificates && worker.certificates.length > 0 && (
                            <motion.div variants={itemVariants} className="bg-white rounded-[1.5rem] p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50/50 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150"></div>

                                <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10 flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
                                        <FileText className="w-5 h-5" />
                                    </span>
                                    Verified Credentials
                                </h2>

                                <div className="space-y-3 relative z-10">
                                    {worker.certificates.map((cert, idx) => (
                                        <motion.div
                                            whileHover={{ x: 4 }}
                                            key={idx}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-amber-200 hover:bg-amber-50/10 hover:shadow-md transition-all cursor-pointer group/cert"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover/cert:bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600 transition-colors">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 truncate">
                                                <div className="font-bold text-gray-900 text-lg tracking-tight mb-0.5">Official Certificate {idx + 1}</div>
                                                <div className="text-xs font-medium text-gray-500">Provided Documentation</div>
                                            </div>
                                            <div className="flex flex-shrink-0 items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full shadow-sm">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Validated
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
