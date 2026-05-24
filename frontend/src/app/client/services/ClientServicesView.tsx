"use client";

import React, { useState } from 'react';
import { ServiceResponseDTO, ServiceStatus } from '@/shared/types/serviceTypes';
import { Calendar, Clock, ChevronRight, X, Briefcase, AlertTriangle, XCircle, RotateCcw, CheckCircle2, Ban } from 'lucide-react';
import { User } from '@/shared/types/userTypes';
import Pagination from '@/app/components/ui/Pagination';
import Image from 'next/image';
import { cancelServiceAction } from '@/app/actions/client/service-actions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ACTIVE_PAGE_SIZE = 6;
const HISTORY_PAGE_SIZE = 6;

interface Props {
    ongoing: ServiceResponseDTO[];
    history: ServiceResponseDTO[];
    cancelled: ServiceResponseDTO[];
    workerMap: Record<string, Partial<User>>;
}

type TabId = 'active' | 'history' | 'cancelled';

type CancelStep = 'reason' | 'confirm';

interface CancelModalState {
    service: ServiceResponseDTO;
    step: CancelStep;
    reason: string;
    isSubmitting: boolean;
}

export default function ClientServicesView({ ongoing, history, cancelled, workerMap }: Props) {
    const [activeTab, setActiveTab] = useState<TabId>('active');

    const [activePage, setActivePage] = useState(1);
    const [historyPage, setHistoryPage] = useState(1);
    const [cancelledPage, setCancelledPage] = useState(1);
    const [cancelModal, setCancelModal] = useState<CancelModalState | null>(null);
    const [localOngoing, setLocalOngoing] = useState<ServiceResponseDTO[]>(ongoing);
    const router = useRouter();

    const activeTotalPages = Math.ceil(localOngoing.length / ACTIVE_PAGE_SIZE);
    const historyTotalPages = Math.ceil(history.length / HISTORY_PAGE_SIZE);
    const cancelledTotalPages = Math.ceil(cancelled.length / HISTORY_PAGE_SIZE);

    const pagedOngoing = localOngoing.slice((activePage - 1) * ACTIVE_PAGE_SIZE, activePage * ACTIVE_PAGE_SIZE);
    const pagedHistory = history.slice((historyPage - 1) * HISTORY_PAGE_SIZE, historyPage * HISTORY_PAGE_SIZE);
    const pagedCancelled = cancelled.slice((cancelledPage - 1) * HISTORY_PAGE_SIZE, cancelledPage * HISTORY_PAGE_SIZE);



    const closeCancelModal = () => {
        if (cancelModal?.isSubmitting) return;
        setCancelModal(null);
    };

    const handleCancelSubmit = async () => {
        if (!cancelModal) return;
        const { service, reason } = cancelModal;

        if (!reason.trim()) {
            toast.error('Please provide a reason for cancellation.');
            return;
        }

        if (cancelModal.step === 'reason') {
            setCancelModal(prev => prev ? { ...prev, step: 'confirm' } : prev);
            return;
        }

        // Confirm step — submit
        setCancelModal(prev => prev ? { ...prev, isSubmitting: true } : prev);
        const res = await cancelServiceAction(service.serviceId, reason.trim());

        if (res.success) {
            toast.success('Service cancelled successfully.');
            setLocalOngoing(prev => prev.filter(s => s.serviceId !== service.serviceId));
            setCancelModal(null);
        } else {
            toast.error(res.error || 'Failed to cancel service.');
            setCancelModal(prev => prev ? { ...prev, isSubmitting: false } : prev);
        }
    };

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
            case ServiceStatus.PENDING:
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
                onClick={() => router.push(`/client/services/${service.serviceId}`)}
                className={`bg-white rounded-[20px] transition-all cursor-pointer overflow-hidden border ${isActive ? 'border-blue-200 shadow-md hover:shadow-lg' : 'border-gray-200 shadow-sm hover:border-gray-300'}`}
            >
                <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">                             <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 relative">
                                {worker && (worker.profileImageUrl || worker.profilePictureUrl) ? (
                                    <Image
                                        src={
                                            ((worker.profileImageUrl || worker.profilePictureUrl) as string)?.startsWith('http')
                                            ? ((worker.profileImageUrl || worker.profilePictureUrl) as string)
                                            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${((worker.profileImageUrl || worker.profilePictureUrl) as string || '').replace(/^\//, '')}`
                                        }
                                        alt={worker.name || "Worker"}
                                        fill
                                        unoptimized
                                        className="w-full h-full object-cover"
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

                    <div className="flex items-center justify-end text-emerald-600 font-semibold text-sm">
                        View Details <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">

            {/* ── Tab Bar ── */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1.5 overflow-x-auto scrollbar-hide">
                {([
                    { id: 'active' as TabId, label: 'Active', count: localOngoing.length, icon: <Briefcase className="w-4 h-4" /> },
                    { id: 'history' as TabId, label: 'Completed', count: history.length, icon: <CheckCircle2 className="w-4 h-4" /> },
                    { id: 'cancelled' as TabId, label: 'Cancelled', count: cancelled.length, icon: <Ban className="w-4 h-4" /> },
                ]).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 min-w-max flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === tab.id
                                ? tab.id === 'cancelled'
                                    ? 'bg-white text-red-600 shadow-sm'
                                    : 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                activeTab === tab.id
                                    ? tab.id === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                    : 'bg-gray-200 text-gray-500'
                            }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Active Services ── */}
            {activeTab === 'active' && (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="w-2 h-8 bg-blue-500 rounded-full mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">Active Services</h2>
                            {localOngoing.length > 0 && (
                                <span className="ml-3 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                    {localOngoing.length}
                                </span>
                            )}
                        </div>
                        {activeTotalPages > 1 && (
                            <span className="text-xs text-gray-400">
                                Page {activePage} of {activeTotalPages}
                            </span>
                        )}
                    </div>

                    {localOngoing.length > 0 ? (
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
                            <p className="text-gray-500">{"You don't have any ongoing services at the moment."}</p>
                        </div>
                    )}
                </>
            )}

            {/* ── Completed History ── */}
            {activeTab === 'history' && (
                <>
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
                </>
            )}

            {/* ── Cancelled Services ── */}
            {activeTab === 'cancelled' && (
                <section>
                    {cancelled.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-90">
                                {pagedCancelled.map(service => renderServiceCard(service, false))}
                            </div>
                            <Pagination
                                currentPage={cancelledPage}
                                totalPages={cancelledTotalPages}
                                onPageChange={(p) => { setCancelledPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            />
                        </>
                    ) : (
                        <div className="bg-white rounded-[24px] border border-gray-200 p-10 text-center shadow-sm">
                            <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Ban className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Cancelled Services</h3>
                            <p className="text-gray-500">{"You haven't cancelled any services."}</p>
                        </div>
                    )}
                </section>
            )}

            {/* ── Cancel Confirmation Modal ── */}
            {cancelModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[24px] max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">
                                    {cancelModal.step === 'reason' ? 'Cancel Service' : 'Confirm Cancellation'}
                                </h3>
                            </div>
                            <button
                                onClick={closeCancelModal}
                                disabled={cancelModal.isSubmitting}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-40"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            {/* Service Info pill */}
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Service</p>
                                <p className="font-bold text-gray-900">{cancelModal.service.category}</p>
                                <p className="text-sm text-gray-500 mt-0.5">{formatDate(cancelModal.service.scheduledDate)}</p>
                            </div>

                            {cancelModal.step === 'reason' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Reason for cancellation <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="cancel-reason-input"
                                            rows={4}
                                            value={cancelModal.reason}
                                            onChange={(e) => setCancelModal(prev => prev ? { ...prev, reason: e.target.value } : prev)}
                                            placeholder="Please tell us why you're cancelling this service..."
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 resize-none transition-all"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">{cancelModal.reason.length}/500 characters</p>
                                    </div>
                                    <div className="flex gap-3 pt-1">
                                        <button
                                            onClick={closeCancelModal}
                                            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all active:scale-95"
                                        >
                                            Keep Service
                                        </button>
                                        <button
                                            id="cancel-reason-next-btn"
                                            onClick={handleCancelSubmit}
                                            disabled={!cancelModal.reason.trim()}
                                            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-sm transition-all active:scale-95 shadow-sm"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-1">
                                        <p className="text-sm font-bold text-red-700">Are you sure you want to cancel?</p>
                                        <p className="text-xs text-red-500">This action cannot be undone. The slot will be freed for others.</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                        <p className="text-xs font-semibold text-gray-500 mb-1">Your reason:</p>
                                        <p className="text-sm text-gray-700 italic">&quot;{cancelModal.reason}&quot;</p>
                                    </div>
                                    <div className="flex gap-3 pt-1">
                                        <button
                                            onClick={() => setCancelModal(prev => prev ? { ...prev, step: 'reason' } : prev)}
                                            disabled={cancelModal.isSubmitting}
                                            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-40"
                                        >
                                            Back
                                        </button>
                                        <button
                                            id="cancel-confirm-btn"
                                            onClick={handleCancelSubmit}
                                            disabled={cancelModal.isSubmitting}
                                            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
                                        >
                                            {cancelModal.isSubmitting ? (
                                                <>
                                                    <RotateCcw className="w-4 h-4 animate-spin" />
                                                    Cancelling...
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-4 h-4" />
                                                    Yes, Cancel Service
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
