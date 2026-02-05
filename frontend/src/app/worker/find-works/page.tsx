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
import {
  Card,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
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
  lon2: number
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

  useEffect(() => {
    loadData();
    // Default to user's first address if available, otherwise try current
    if (user?.address && user.address.length > 0) {
      setWorkerLocation({
        lat: user.address[0].lat,
        lng: user.address[0].lng,
        label: "Home Address",
      });
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reqRes, catRes] = await Promise.all([
        getOpenServiceRequestsAction(),
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
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
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
      },
      () => {
        toast.error("Unable to retrieve your location");
      }
    );
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
          req.location.lng
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
    <div className="min-h-screen bg-slate-50 text-slate-900 animate-in fade-in duration-500">
      {/* Dark Header Section */}
      <div className="bg-[#1B4332] text-white pb-12 pt-10 px-6 md:px-10 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Find Open Works
              </h1>
            </div>

            <div className="flex items-center gap-3 bg-[#153426] p-2 rounded-xl border border-[#2d5f4e]">
              <Button
                onClick={handleGetCurrentLocation}
                className="bg-[#DC2626] hover:bg-[#b91c1c] text-white border-none"
                size="sm"
              >
                <Navigation size={16} className="mr-2" />
                Use Current Location
              </Button>
              <div className="h-4 w-px bg-[#DC2626] mx-2" />
              <div className="flex items-center gap-2 text-sm text-green-100 pr-2">
                <MapPin size={16} className="text-[#DC2626]" />
                <span className="font-medium truncate max-w-[150px]">
                  {workerLocation?.label || "No Location Set"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 -mt-8">
        {/* Filters Card */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-slate-200 focus:ring-[#DC2626]"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            <Filter size={16} className="text-slate-400 mr-1" />
            <select
              className="h-11 pl-3 pr-8 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
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
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-60 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-[#DC2626]" />
            <p className="text-slate-500 font-medium animate-pulse">
              Finding nearby requests...
            </p>
          </div>
        ) : processedRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No works found
            </h3>
            <p className="text-slate-500 mt-2 text-center max-w-sm">
              Try adjusting your search or location to find more opportunities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            {processedRequests.map((request) => (
              <Card
                key={request.requestId}
                className="group flex flex-col h-full overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-xl ring-1 ring-slate-200 hover:ring-[#DC2626]/30"
              >
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  {request.servicePhotos?.[0] ? (
                    <img
                      src={request.servicePhotos[0]}
                      alt={request.title}
                      className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-slate-200 text-slate-400">
                      <ImageIcon size={40} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-slate-700 backdrop-blur-sm shadow-sm">
                      {getCategoryName(request.category)}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 text-xs font-medium opacity-90 mb-1">
                      <MapPin size={12} className="text-[#DC2626]" />
                      <span>
                        {request.distance < 1000
                          ? `${request.distance.toFixed(1)} km away`
                          : "Unknown Distance"}
                      </span>
                    </div>
                  </div>
                </div>

                <CardContent className="flex-1 p-5 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#DC2626] transition-colors">
                    {request.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                    {request.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Calendar size={14} className="text-slate-400" />
                      <span>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {request.budget && (
                      <div className="flex items-center gap-1 text-green-700 font-bold text-sm bg-green-50 px-2 py-1 rounded">
                        <IndianRupee size={12} />
                        <span>{request.budget}</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-4 bg-slate-50 border-t border-slate-100">
                  <Link href={`/worker/find-works/${request.requestId}`} className="w-full">
                    <Button
                      className="w-full bg-[#DC2626] hover:bg-[#b91c1c] text-white font-medium group/btn"
                    >
                      View Details
                      <ArrowUpRight
                        size={16}
                        className="ml-2 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                      />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}