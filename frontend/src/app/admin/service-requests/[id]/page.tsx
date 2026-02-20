"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    DollarSign,
    Tag,
    Clock,
    User,
    AlertCircle,
    CheckCircle,
    Loader2,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/app/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/app/components/ui/carousel";
import { ServiceRequestStatus } from "@/shared/enums/ServiceRequestStatus";
import { ServiceRequestResponse } from "@/shared/types/ServiceRequestResponse";
import { getServiceRequestByIdAction } from "@/app/actions/serviceRequest/admin/adminServiceRequest.actions";

export default function ServiceRequestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [request, setRequest] = useState<ServiceRequestResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequest = async () => {
            if (!id) return;
            setLoading(true);
            const res = await getServiceRequestByIdAction(id as string);

            if (res.success && res.payload) {
                setRequest(res.payload);
            } else {
                setError(res.message);
            }
            setLoading(false);
        };

        fetchRequest();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 text-[#1B4332] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading details...</p>
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Request Not Found</h2>
                <p className="text-gray-500 mt-2">{error || "The service request you are looking for does not exist."}</p>
                <Button variant="outline" className="mt-6" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    const getStatusBadge = (status: ServiceRequestStatus) => {
        switch (status) {
            case ServiceRequestStatus.OPEN:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold border border-blue-100">
                        <AlertCircle size={14} /> Open
                    </span>
                );
            case ServiceRequestStatus.ACCEPTED:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100">
                        <CheckCircle size={14} /> Accepted
                    </span>
                );
            default:
                return <span className="text-gray-500">{status}</span>;
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col gap-6 mb-8">
                <Button
                    variant="ghost"
                    className="w-fit -ml-2 text-gray-500 hover:text-gray-900"
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={16} /> Back to Requests
                </Button>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
                                {request.category}
                            </span>
                            <span className="text-sm font-mono text-gray-400">#{request.requestId}</span>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{request.title}</h1>
                    </div>
                    <div>{getStatusBadge(request.status)}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <Card className="border-gray-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg">Description</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {request.description}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Photos */}
                    {request.servicePhotos && request.servicePhotos.length > 0 && (
                        <Card className="border-gray-100 shadow-sm overflow-hidden">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                                <CardTitle className="text-lg">Photos</CardTitle>
                                <CardDescription>
                                    {request.servicePhotos.length} photo(s) attached
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <Carousel className="w-full max-w-sm mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl">
                                    <CarouselContent>
                                        {request.servicePhotos.map((photo, index) => (
                                            <CarouselItem key={index}>
                                                <div className="p-1">
                                                    <div className="rounded-xl overflow-hidden aspect-video relative border border-gray-100 bg-gray-50">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={photo}
                                                            alt={`Service photo ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column (Sidebar) */}
                <div className="space-y-6">
                    {/* Request Details */}
                    <Card className="border-gray-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">
                                Request Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <DollarSign size={16} />
                                    </div>
                                    <span className="font-medium text-sm">Budget</span>
                                </div>
                                <span className="font-bold text-gray-900">
                                    {request.budget ? `$${request.budget.toFixed(2)}` : "Negotiable"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Tag size={16} />
                                    </div>
                                    <span className="font-medium text-sm">Category</span>
                                </div>
                                <span className="font-bold text-gray-900">{request.category}</span>
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                        <Calendar size={16} />
                                    </div>
                                    <span className="font-medium text-sm">Created</span>
                                </div>
                                <span className="font-bold text-gray-900 text-xs">
                                    {new Date(request.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location */}
                    <Card className="border-gray-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">
                                Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium text-gray-900">Coordinates</p>
                                    <p className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                        {request.location?.lat.toFixed(6)}, {request.location?.lng.toFixed(6)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Allocation Info */}
                    {request.status === ServiceRequestStatus.ACCEPTED && (
                        <Card className="border-gray-100 shadow-sm overflow-hidden">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">
                                    Allocation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
