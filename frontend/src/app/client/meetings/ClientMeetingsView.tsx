"use client";

import React from 'react';
import { ServiceResponseDTO, ServiceStatus, SLOT_LABELS } from '@/shared/types/serviceTypes';
import { Calendar, Clock, ChevronRight, Video } from 'lucide-react';
import { User } from '@/shared/types/userTypes';
import Pagination from '@/app/components/ui/Pagination';
import Link from 'next/link';

const ACTIVE_PAGE_SIZE = 6;
const HISTORY_PAGE_SIZE = 6;

interface Props {
    scheduled: ServiceResponseDTO[];
    history: ServiceResponseDTO[];
    workerMap: Record<string, User>;
}

export default function ClientMeetingsView({ scheduled, history, workerMap }: Props) {
    const [activePage, setActivePage] = React.useState(1);
    const [historyPage, setHistoryPage] = React.useState(1);

    const activeTotalPages = Math.ceil(scheduled.length / ACTIVE_PAGE_SIZE);
    const historyTotalPages = Math.ceil(history.length / HISTORY_PAGE_SIZE);

    const pagedScheduled = scheduled.slice((activePage - 1) * ACTIVE_PAGE_SIZE, activePage * ACTIVE_PAGE_SIZE);
    const pagedHistory = history.slice((historyPage - 1) * HISTORY_PAGE_SIZE, historyPage * HISTORY_PAGE_SIZE);

    const getStatusBadge = (status: ServiceStatus | string) => {
        switch (status) {
            case ServiceStatus.CONFIRMED:
            case ServiceStatus.IN_PROGRESS:
                return <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 shadow-sm animate-pulse">Confirmed</span>;
            case ServiceStatus.COMPLETED:
                return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 shadow-sm">Completed</span>;
            case ServiceStatus.CANCELLED:
            case ServiceStatus.CANCELLED_BY_CLIENT:
            case ServiceStatus.CANCELLED_BY_WORKER:
                return <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-100 shadow-sm">Cancelled</span>;
            case ServiceStatus.OPEN:
            case 'PENDING':
                return <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold border border-yellow-100 shadow-sm">Pending</span>;
            default:
                return <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-bold border border-gray-200 shadow-sm">{status}</span>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const renderMeetingCard = (meeting: ServiceResponseDTO, isActive: boolean) => {
        const worker = workerMap[meeting.workerId];
        const slotTypeName = meeting.selectedSlots[0]?.slotType;
        const slotLabel = slotTypeName && SLOT_LABELS[slotTypeName] ? SLOT_LABELS[slotTypeName] : "Time TBD";

        return (
            <Link
                key={meeting.serviceId}
                href={`/client/meetings/${meeting.serviceId}`}
                className={`block bg-white rounded-[20px] transition-all overflow-hidden border group ${isActive ? 'border-emerald-200 shadow-md hover:shadow-lg' : 'border-gray-200 shadow-sm hover:border-emerald-300 hover:shadow-md'}`}
            >
                <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                                {worker && (worker.profileImageUrl || worker.profilePictureUrl) ? (
                                    <img
                                        src={
                                            ((worker.profileImageUrl || worker.profilePictureUrl) as string)?.startsWith('http')
                                            ? ((worker.profileImageUrl || worker.profilePictureUrl) as string)
                                            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${((worker.profileImageUrl || worker.profilePictureUrl) as string || '').replace(/^\//, '')}`
                                        }
                                        alt={worker.name} className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="font-bold text-gray-400 text-lg">{worker?.name?.substring(0, 2).toUpperCase() || 'W'}</span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg leading-tight">{worker ? worker.name : 'Unknown Worker'}</h3>
                                <p className="text-sm text-emerald-600 font-bold flex items-center gap-1 mt-0.5"><Video className="w-3 h-3"/> Video Call</p>
                            </div>
                        </div>
                        {getStatusBadge(meeting.status)}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100 space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="font-semibold">{formatDate(meeting.scheduledDate)}</span>
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="font-bold text-gray-700">{slotLabel}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-end text-emerald-600 font-semibold text-sm group-hover:text-emerald-700 transition-colors">
                        View Details <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div className="space-y-10">

            {/* Active Meetings Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="w-2 h-8 bg-emerald-500 rounded-full mr-3" />
                        <h2 className="text-2xl font-bold text-gray-900">Scheduled Meetings</h2>
                        {scheduled.length > 0 && (
                            <span className="ml-3 px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                {scheduled.length}
                            </span>
                        )}
                    </div>
                    {activeTotalPages > 1 && (
                        <span className="text-xs text-gray-400">
                            Page {activePage} of {activeTotalPages}
                        </span>
                    )}
                </div>

                {scheduled.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pagedScheduled.map(meeting => renderMeetingCard(meeting, true))}
                        </div>
                        <Pagination
                            currentPage={activePage}
                            totalPages={activeTotalPages}
                            onPageChange={(p) => { setActivePage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        />
                    </>
                ) : (
                    <div className="bg-white rounded-[24px] border border-gray-200 p-10 text-center shadow-sm">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Video className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Scheduled Meetings</h3>
                        <p className="text-gray-500">You don't have any upcoming video consultations.</p>
                    </div>
                )}
            </section>

            {/* Meeting History Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="w-2 h-8 bg-gray-300 rounded-full mr-3" />
                        <h2 className="text-2xl font-bold text-gray-900">Meeting History</h2>
                        {history.length > 0 && (
                            <span className="ml-3 px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                                {history.length}
                            </span>
                        )}
                    </div>
                    {historyTotalPages > 1 && (
                        <span className="text-xs text-gray-400">
                            Page {historyPage} of {historyTotalPages}
                        </span>
                    )}
                </div>

                {history.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-90">
                            {pagedHistory.map(meeting => renderMeetingCard(meeting, false))}
                        </div>
                        <Pagination
                            currentPage={historyPage}
                            totalPages={historyTotalPages}
                            onPageChange={(p) => { setHistoryPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        />
                    </>
                ) : (
                    <div className="bg-white rounded-[24px] border border-gray-200 p-10 text-center shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No History</h3>
                        <p className="text-gray-500">Your past meetings will appear here.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
