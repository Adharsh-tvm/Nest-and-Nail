"use client";

import React, { useState } from 'react';
import { ServiceResponseDTO, ServiceStatus } from '@/shared/types/serviceTypes';
import { Calendar, Clock, MapPin, ChevronRight, X, Briefcase, Star, IndianRupee } from 'lucide-react';
import { User } from '@/shared/types/userTypes';
import Pagination from '@/app/components/ui/Pagination';

const ACTIVE_PAGE_SIZE = 6;
const HISTORY_PAGE_SIZE = 6;

interface Props {
    ongoing: ServiceResponseDTO[];
    history: ServiceResponseDTO[];
    workerMap: Record<string, User>;
}

export default function ClientServicesView({ ongoing, history, workerMap }: Props) {
    const [selectedService, setSelectedService] = useState<ServiceResponseDTO | null>(null);
    const [activePage, setActivePage] = useState(1);
    const [historyPage, setHistoryPage] = useState(1);

    const activeTotalPages = Math.ceil(ongoing.length / ACTIVE_PAGE_SIZE);
    const historyTotalPages = Math.ceil(history.length / HISTORY_PAGE_SIZE);

    const pagedOngoing = ongoing.slice((activePage - 1) * ACTIVE_PAGE_SIZE, activePage * ACTIVE_PAGE_SIZE);
    const pagedHistory = history.slice((historyPage - 1) * HISTORY_PAGE_SIZE, historyPage * HISTORY_PAGE_SIZE);

    const getStatusBadge = (status: ServiceStatus | string) => {
        switch (status) {
            case ServiceStatus.CONFIRMED:
            case ServiceStatus.IN_PROGRESS:
                return <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 shadow-sm animate-pulse">Active</span>;
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

    const renderServiceCard = (service: ServiceResponseDTO, isActive: boolean) => {
        const worker = workerMap[service.workerId];

        return (
            <div
                key={service.serviceId}
                onClick={() => setSelectedService(service)}
                className={`bg-white rounded-[20px] transition-all cursor-pointer overflow-hidden border ${isActive ? 'border-blue-200 shadow-md hover:shadow-lg' : 'border-gray-200 shadow-sm hover:border-gray-300'}`}
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
                                <p className="text-sm text-gray-500 font-medium">{service.category}</p>
                            </div>
                        </div>
                        {getStatusBadge(service.status)}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="font-semibold">{formatDate(service.scheduledDate)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{service.selectedSlots.length} Slot(s)</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-end text-emerald-600 font-semibold text-sm group-hover:text-emerald-700">
                        View Details <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-10">

            {/* Active Services Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="w-2 h-8 bg-blue-500 rounded-full mr-3" />
                        <h2 className="text-2xl font-bold text-gray-900">Active Services</h2>
                        {ongoing.length > 0 && (
                            <span className="ml-3 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                {ongoing.length}
                            </span>
                        )}
                    </div>
                    {activeTotalPages > 1 && (
                        <span className="text-xs text-gray-400">
                            Page {activePage} of {activeTotalPages}
                        </span>
                    )}
                </div>

                {ongoing.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pagedOngoing.map(service => renderServiceCard(service, true))}
                        </div>
                        <Pagination
                            currentPage={activePage}
                            totalPages={activeTotalPages}
                            onPageChange={(p) => { setActivePage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        />
                    </>
                ) : (
                    <div className="bg-white rounded-[24px] border border-gray-200 p-10 text-center shadow-sm">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Services</h3>
                        <p className="text-gray-500">You don't have any ongoing services at the moment.</p>
                    </div>
                )}
            </section>

            {/* Service History Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="w-2 h-8 bg-gray-300 rounded-full mr-3" />
                        <h2 className="text-2xl font-bold text-gray-900">Service History</h2>
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
                            {pagedHistory.map(service => renderServiceCard(service, false))}
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
                        <p className="text-gray-500">Your past services will appear here.</p>
                    </div>
                )}
            </section>

            {/* Service Details Modal */}
            {selectedService && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[24px] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between z-10">
                            <h3 className="font-bold text-lg text-gray-900">Service Details</h3>
                            <button onClick={() => setSelectedService(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-sm text-gray-400">ID: {selectedService.serviceId.substring(0, 8)}</span>
                                {getStatusBadge(selectedService.status)}
                            </div>

                            {workerMap[selectedService.workerId] && (
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="w-14 h-14 rounded-full overflow-hidden bg-white border border-gray-200 shadow-sm shrink-0">
                                        <img
                                            src={
                                                ((workerMap[selectedService.workerId].profileImageUrl || workerMap[selectedService.workerId].profilePictureUrl) as string)?.startsWith('http')
                                                ? ((workerMap[selectedService.workerId].profileImageUrl || workerMap[selectedService.workerId].profilePictureUrl) as string)
                                                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${((workerMap[selectedService.workerId].profileImageUrl || workerMap[selectedService.workerId].profilePictureUrl) as string || '').replace(/^\//, '')}`
                                            }
                                            alt="Worker" className="w-full h-full object-cover"
                                            onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=Worker&background=random'; }}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{workerMap[selectedService.workerId].name}</h4>
                                        <p className="text-sm font-medium text-gray-500">{selectedService.category}</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="font-bold text-gray-900 mb-3 flex items-center"><Calendar className="w-4 h-4 mr-2" /> Booking Schedule</h4>
                                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-semibold">Start Date</span>
                                        <span className="font-bold">{formatDate(selectedService.scheduledDate)}</span>
                                    </div>
                                    <hr className="border-emerald-200/50" />
                                    <div>
                                        <span className="font-semibold text-sm block mb-2">Selected Slots</span>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedService.selectedSlots.map((slot, idx) => (
                                                <div key={idx} className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-200 shadow-sm">
                                                    {formatDate(slot.date)} - {slot.slotType.replace('_', ' ')}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 mb-3 flex items-center"><IndianRupee className="w-4 h-4 mr-2" /> Payment Info</h4>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
                                    <span className="font-medium text-gray-600">Status</span>
                                    <span className="font-bold text-gray-900">{selectedService.paymentStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
