"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { getServiceRequestByIdAction } from "@/app/actions/serviceRequest/client/clientServiceRequest.actions";
import { ServiceRequestResponse } from "@/shared/types/ServiceRequestResponse";
import { Button } from "@/app/components/ui/button";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    DollarSign,
    Briefcase,
    Loader2,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Image as ImageIcon,
    Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { deleteServiceRequestAction } from "@/app/actions/serviceRequest/client/clientServiceRequest.actions";
import { ServiceRequestStatus } from "@/shared/enums/ServiceRequestStatus";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        pending:
            "bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-500/10",
        accepted: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10",
        in_progress:
            "bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/10",
        completed: "bg-green-50 text-green-700 border-green-200 ring-green-500/10",
        cancelled: "bg-red-50 text-red-700 border-red-200 ring-red-500/10",
    } as const;

    const icons = {
        pending: <Clock size={14} />,
        accepted: <CheckCircle2 size={14} />,
        in_progress: <Loader2 size={14} className="animate-spin" />,
        completed: <CheckCircle2 size={14} />,
        cancelled: <XCircle size={14} />,
    };

    const style =
        styles[status as keyof typeof styles] ||
        "bg-gray-50 text-gray-700 border-gray-200 ring-gray-500/10";
    const icon = icons[status as keyof typeof icons] || <AlertCircle size={14} />;

    return (
        <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ring-1 ${style} flex items-center gap-2`}
        >
            {icon}
            {status.replace("_", " ")}
        </span>
    );
};

export default function ServiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useUserStore();
    const [request, setRequest] = useState<ServiceRequestResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (params.id) {
            loadRequest(params.id as string);
        }
    }, [params.id]);

    const loadRequest = async (id: string) => {
        try {
            setLoading(true);
            const res = await getServiceRequestByIdAction(id);
            if (!res.success) {
                toast.error(res.message);
                router.push("/client/service-requests"); // Redirect back on error
                return;
            }
            setRequest(res.payload);
        } catch (error) {
            toast.error("Failed to load request details");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!request) return;

        setIsDeleting(true);
        try {
            const res = await deleteServiceRequestAction(request.requestId);
            if (res.success) {
                toast.success("Service request deleted successfully");
                router.push("/client/service-requests");
            } else {
                toast.error(res.message || "Failed to delete request");
            }
        } catch (error) {
            toast.error("An error occurred while deleting the request");
            console.error(error);
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 animate-in fade-in duration-500">
                <Loader2 className="h-12 w-12 animate-spin text-[#1B4332] mb-4" />
                <p className="text-gray-500 font-medium">
                    Loading specific details...
                </p>
            </div>
        );
    }

    if (!request) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50/30 pb-20 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header / Nav */}
            <div className=" border-b border-gray-200 sticky top-0 z-20 backdrop-blur-md bg-white/80">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-[#1B4332] hover:bg-green-50 gap-2 pl-2 pr-4 transition-all"
                    >
                        <ArrowLeft size={18} />
                        <span className="font-medium">Back to Requests</span>
                    </Button>
                    <div className="text-sm text-gray-400 font-mono hidden sm:block">
                        ID: {request.requestId.slice(0, 8)}...
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-3 flex-1">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            {request.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={16} className="text-gray-400" />
                                <span>Posted {new Date(request.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="hidden sm:block h-1 w-1 rounded-full bg-gray-300" />
                            <div className="flex items-center gap-1.5 bg-[#1B4332]/10 px-3 py-1.5 rounded-full border border-[#1B4332]/20">
                                <Calendar size={16} className="text-[#1B4332]" />
                                <span className="font-bold text-[#1B4332]">
                                    Service Date: {request.serviceDate ? new Date(request.serviceDate).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : "Not specified"}
                                </span>
                            </div>
                            <div className="hidden sm:block h-1 w-1 rounded-full bg-gray-300" />
                            <div className="flex items-center gap-1.5">
                                <Briefcase size={16} className="text-gray-400" />
                                {/* Note: In a real app, you might want to fetch category name properly here too */}
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                                    {/* For now displaying ID as placeholder or passed category name if available */}
                                    Request ID: {request.requestId}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <StatusBadge status={request.status} />
                        {request.budget && (
                            <div className="flex items-center gap-1 text-2xl font-bold text-[#1B4332]">
                                <span className="text-base font-normal text-gray-400">Budget:</span>
                                <IndianRupee size={20} className="text-[#1B4332]" />
                                {request.budget.toLocaleString()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Start Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Image Gallery */}
                        {request.servicePhotos && request.servicePhotos.length > 0 ? (
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-2">
                                <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden relative group">
                                    <img
                                        src={request.servicePhotos[activeImageIndex]}
                                        alt="Service Request Main"
                                        className="w-full h-full object-contain"
                                    />
                                    {request.servicePhotos.length > 1 && (
                                        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                                            {request.servicePhotos.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveImageIndex(idx)}
                                                    className={`w-2 h-2 rounded-full transition-all shadow-sm ${idx === activeImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {request.servicePhotos.length > 1 && (
                                    <div className="grid grid-cols-5 gap-2 mt-2">
                                        {request.servicePhotos.map((photo, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveImageIndex(idx)}
                                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${idx === activeImageIndex
                                                    ? "border-[#1B4332] opacity-100"
                                                    : "border-transparent opacity-60 hover:opacity-100"
                                                    }`}
                                            >
                                                <img
                                                    src={photo}
                                                    alt={`Thumbnail ${idx}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-gray-400 gap-3">
                                <ImageIcon size={48} className="opacity-20" />
                                <span className="font-medium">No photos provided</span>
                            </div>
                        )}

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4">
                            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                                Description
                            </h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {request.description}
                            </p>
                        </div>

                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-6">

                        {/* Location Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <MapPin size={16} /> Location
                            </h3>

                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                {/* Map Placeholder or simple lat/lng display if no map integration */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Latitude:</span>
                                        <span className="font-mono text-gray-700">{request.location.lat.toFixed(6)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Longitude:</span>
                                        <span className="font-mono text-gray-700">{request.location.lng.toFixed(6)}</span>
                                    </div>
                                    {/* Add a button to open in Google Maps */}
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${request.location.lat},${request.location.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 block w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#1B4332] text-sm font-medium py-2 rounded-lg text-center transition-colors"
                                    >
                                        View on Maps
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Additional Details / Actions */}
                        <div className="bg-[#1B4332]/5 rounded-2xl p-6 border border-[#1B4332]/10 space-y-4">
                            <h3 className="text-sm font-bold text-[#1B4332] uppercase tracking-wider">
                                Quick Actions
                            </h3>
                            <p className="text-xs text-gray-600">
                                Need to modify this request? Currently, editing is disabled once published. Cancel and create a new one if necessary.
                            </p>

                            {request.status === ServiceRequestStatus.OPEN && (
                                <Button
                                    className="w-full justify-start mt-4 bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all"
                                    onClick={() => setIsDeleteModalOpen(true)}
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete Request
                                </Button>
                            )}
                        </div>

                    </div>

                </div>

            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            Delete Service Request
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            Are you sure you want to delete this service request?
                            <span className="block mt-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-800 text-sm font-medium">
                                This action cannot be undone and will permanently remove this request from the platform.
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeleting}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Request"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}

// Helper Icon for Budget
function IndianRupee({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M6 3h12" />
            <path d="M6 8h12" />
            <path d="m6 13 8.5 10" />
            <path d="M6 13h3" />
            <path d="M9 13c6.667 0 6.667-10 0-10" />
        </svg>
    )
}
