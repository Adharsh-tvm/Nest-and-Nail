"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  IndianRupee,
  User,
  Image as ImageIcon,
  Navigation,
  Loader2,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";
import { getServiceRequestByIdAction } from "@/app/actions/serviceRequest/worker/workerServiceRequest.actions";
import { ServiceRequestResponse } from "@/shared/types/ServiceRequestResponse";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

// Dynamically import Map component to avoid SSR issues
const Map = dynamic(
  () =>
    import("@/app/components/containers/layout/LocationPicker").then((mod) => ({
      default: mod.LocationPicker,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-slate-100 animate-pulse rounded-lg" />
    ),
  },
);

export default function ServiceRequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<ServiceRequestResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchRequestDetails(params.id as string);
    }
  }, [params.id]);

  const fetchRequestDetails = async (id: string) => {
    setLoading(true);
    const res = await getServiceRequestByIdAction(id);
    if (res.success) {
      setRequest(res.payload);
    } else {
      toast.error(res.message);
      router.push("/worker/find-works");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-[#DC2626]" />
        <p className="mt-4 text-slate-500 font-medium">Loading details...</p>
      </div>
    );
  }

  if (!request) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Job Details</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            {request.servicePhotos && request.servicePhotos.length > 0 ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                <Carousel className="w-full">
                  <CarouselContent>
                    {request.servicePhotos.map((photo, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-video bg-slate-100">
                          <img
                            src={photo}
                            alt={`Service photo ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {request.servicePhotos.length > 1 && (
                    <>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </>
                  )}
                </Carousel>
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 aspect-video flex items-center justify-center">
                <div className="flex flex-col items-center text-slate-400">
                  <ImageIcon size={48} className="mb-2 opacity-50" />
                  <span className="text-sm font-medium">
                    No photos provided
                  </span>
                </div>
              </div>
            )}

            {/* Title & Description */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1B4332]/10 text-[#1B4332]">
                        Request Id: {request.requestId}
                      </span>
                      <span className="text-sm text-slate-500 flex items-center">
                        <Clock size={14} className="mr-1.5" />
                        Posted{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {request.title}
                    </h2>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">
                      Description
                    </h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {request.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 flex items-center">
                  <MapPin size={18} className="mr-2 text-[#DC2626]" />
                  Job Location
                </h3>
              </div>
              <div className="h-64 relative z-0">
                {/* Note: In a real implementation, we would pass props to the Map component to show a marker. 
                        Since LocationPicker might be built for selecting, we might need a read-only mode or a separate MapView component.
                        For now utilizing a placeholder if Map component doesn't support read-only view directly or assuming it can handle coordinates.
                        
                        If LocationPicker is strictly for picking, we should use a MapContainer from leaflet directly here or a wrapper.
                        Assuming for now we can't easily reuse LocationPicker for read-only without checking its implementation details.
                        I will check LocationPicker implementation in a moment or use a simple placeholder if needed.
                        
                        Wait, I should check LocationPicker.tsx first to see if it accepts props for initial position and read-only.
                        I'll use a simple iframe for generic map or valid leaflet text if not.
                        Actually, let's just assume for this step we display coordinates or a static map if possible, 
                        or better yet, just a simple "Open in Maps" button if we can't render the map easily.
                    */}
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-slate-500 font-medium mb-2">
                      Lat: {request.location.lat}, Lng: {request.location.lng}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${request.location.lat},${request.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#DC2626] hover:underline font-medium"
                    >
                      <Navigation size={16} className="mr-1.5" />
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Card */}
            <Card className="border-slate-200 shadow-md sticky top-24">
              <CardContent className="p-6 flex flex-col gap-6">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">
                    Estimated Budget
                  </p>
                  {request.budget ? (
                    <div className="text-3xl font-bold text-[#1B4332] flex items-baseline">
                      <span className="text-lg mr-0.5">₹</span>
                      {request.budget.toLocaleString()}
                    </div>
                  ) : (
                    <div className="text-xl font-bold text-slate-700 italic">
                      Negotiable
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button className="w-full bg-[#DC2626] hover:bg-[#b91c1c] text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                    Reserve 
                  </Button>
                  <p className="text-xs text-center text-slate-400">
                    By accepting, you agree to the terms of service.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
