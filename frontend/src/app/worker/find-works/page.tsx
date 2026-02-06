"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  IndianRupee,
  Search,
  Filter,
  ArrowUpRight,
  Navigation,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Address } from "@/shared/types/addressType";
import { getOpenServiceRequestsAction } from "@/app/actions/serviceRequest/worker/workerServiceRequest.actions";
import { getAllCategoriesAction } from "@/app/actions/admin/category-actions";
import { ServiceRequestResponse } from "@/shared/types/ServiceRequestResponse";
import { Category } from "@/shared/types/categoryTypes";
import toast from "react-hot-toast";

// Haversine formula to calculate distance
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export default function WorkerFindWorksPage() {
  const { user } = useUserStore();
  const [requests, setRequests] = useState<ServiceRequestResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Location State
  const [workerLocation, setWorkerLocation] = useState<{
    lat: number;
    lng: number;
    label: string;
  } | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    if (user?.address && user.address.length > 0 && !workerLocation) {
      setWorkerLocation({
        lat: user.address[0].lat,
        lng: user.address[0].lng,
        label: "Home Address",
      });
    }
  }, [user, workerLocation]);

  useEffect(() => {
    if (!workerLocation) return;
    loadData();
  }, [workerLocation]);

  const loadData = async () => {
    if (!workerLocation) return;

    setLoading(true);

    const [reqRes, catRes] = await Promise.all([
      getOpenServiceRequestsAction(workerLocation.lat, workerLocation.lng),
      getAllCategoriesAction(),
    ]);

    if (reqRes.success) {
      setRequests(reqRes.payload);
    } else {
      toast.error(reqRes.message);
    }

    if (catRes.success) {
      setCategories(catRes.payload);
    }

    setLoading(false);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setWorkerLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: "Current Location",
        });
        toast.success("Location updated");
        setIsLocationModalOpen(false);
      },
      () => {
        toast.error("Unable to retrieve your location");
      },
    );
  };

  const handleSelectSavedAddress = (address: Address) => {
    setWorkerLocation({
      lat: address.lat,
      lng: address.lng,
      label: address.label,
    });
    setIsLocationModalOpen(false);
    toast.success(`Location set to ${address.label}`);
  };

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "Service";

  const processedRequests = requests
    .map((req) => {
      let distance = Infinity;
      if (workerLocation && req.location) {
        distance = calculateDistance(
          workerLocation.lat,
          workerLocation.lng,
          req.location.lat,
          req.location.lng,
        );
      }
      return { ...req, distance };
    })
    .filter((req) => {
      const matchesSearch =
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || req.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => a.distance - b.distance); // Sort by distance

  return (
    <div className="min-h-screen bg-gray-50/50 text-slate-900 font-sans">
      {/* Hero / Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Find Work
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Discover local opportunities near you
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Dialog
                open={isLocationModalOpen}
                onOpenChange={setIsLocationModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 border-slate-200 bg-white hover:bg-slate-50 hover:text-[#DC2626] text-slate-700 font-medium transition-colors"
                  >
                    <MapPin size={16} className="mr-2 text-[#DC2626]" />
                    <span className="max-w-[120px] truncate">
                      {workerLocation?.label || "Set Location"}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl bg-white">
                  <DialogHeader className="bg-[#1B4332] px-6 py-6 text-white">
                    <DialogTitle className="text-xl font-bold text-white">
                      Select Location
                    </DialogTitle>
                    <p className="text-green-100/80 text-sm font-normal">
                      Choose where you want to find work
                    </p>
                  </DialogHeader>
                  <div className="flex flex-col gap-3 p-6 pt-2">
                    <Button
                      onClick={handleGetCurrentLocation}
                      className="w-full justify-start bg-red-50/50 hover:bg-red-50 text-slate-900 border border-[#DC2626]/20 hover:border-[#DC2626] transition-all duration-300 py-6"
                      variant="outline"
                    >
                      <Navigation size={18} className="mr-3 text-[#DC2626]" />
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="font-bold text-slate-900">
                          Current Location
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Use GPS to find nearby works
                        </span>
                      </div>
                    </Button>

                    {user?.address && user.address.length > 0 && (
                      <>
                        <div className="relative py-2">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-500">
                              Or Saved Addresses
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {user.address.map((addr, index) => (
                            <Button
                              key={index}
                              onClick={() => handleSelectSavedAddress(addr)}
                              className="w-full justify-start bg-white hover:bg-green-50 text-slate-900 border border-slate-200 hover:border-[#1B4332]/30 h-auto py-3 group transition-all"
                              variant="ghost"
                            >
                              <MapPin
                                size={18}
                                className="mr-3 text-[#1B4332]"
                              />
                              <div className="flex flex-col items-start text-left gap-0.5">
                                <span className="font-semibold capitalize text-slate-700 group-hover:text-[#1B4332] transition-colors">
                                  {addr.label}
                                </span>
                                <span className="text-xs text-slate-500 font-medium line-clamp-1">
                                  {addr.street}, {addr.city}
                                </span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-all"
              />
            </div>
            <div className="relative md:w-48">
              <select
                className="w-full h-10 pl-3 pr-8 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:bg-white transition-all appearance-none cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#DC2626]" />
            <p className="text-slate-500 text-sm font-medium">
              Scanning your area for jobs...
            </p>
          </div>
        ) : processedRequests.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              No jobs found nearby
            </h3>
            <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto">
              Try expanding your search area or changing filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {processedRequests.map((request) => (
              <Card
                key={request.requestId}
                className="group flex flex-col overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-[#DC2626]/30 transition-all duration-300 bg-white"
              >
                {/* Card Header with Image & Badge */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {request.servicePhotos?.[0] ? (
                    <img
                      src={request.servicePhotos[0]}
                      alt={request.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-slate-50">
                      <ImageIcon className="h-10 w-10 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-white/95 text-slate-700 shadow-sm backdrop-blur-[2px] ring-1 ring-black/5">
                      {getCategoryName(request.category)}
                    </span>
                  </div>
                  {/* Distance Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                    <div className="flex items-center text-white/95 text-xs font-medium">
                      <MapPin size={12} className="text-[#DC2626] mr-1" />
                      {request.distance < 1000
                        ? `${request.distance.toFixed(1)} km away`
                        : "Unknown Distance"}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <CardContent className="flex-1 p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-slate-900 text-base line-clamp-2 leading-tight group-hover:text-[#DC2626] transition-colors">
                      {request.title}
                    </h3>
                  </div>

                  {/* Budget Highlight */}
                  {request.budget ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-green-700">
                        ₹{request.budget.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">est. budget</span>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400 font-medium italic">
                      Budget negotiable
                    </div>
                  )}

                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {request.description}
                  </p>
                </CardContent>

                <CardFooter className="p-4 pt-0 mt-auto">
                  <div className="w-full flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="text-xs text-slate-400 font-medium flex items-center">
                      <Calendar size={12} className="mr-1.5" />
                      {new Date(request.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>

                    <Link href={`/worker/find-works/${request.requestId}`}>
                      <Button size="sm" className="bg-[#DC2626] hover:bg-[#b91c1c] text-white rounded-lg h-9 px-4 text-xs font-semibold shadow-sm hover:shadow transition-all">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
