"use client"

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Briefcase, 
  CreditCard,
  FileText,
  AlignLeft,
  Home
} from "lucide-react";
import toast from "react-hot-toast";

import { AdminServiceResponseDTO } from "@/shared/types/serviceTypes";
import { getAdminServiceDetailsAction } from "@/app/actions/admin/service-actions";

const AdminServiceDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;

  const [service, setService] = useState<AdminServiceResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!serviceId) return;
      try {
        setLoading(true);
        const res = await getAdminServiceDetailsAction(serviceId);
        if (!res.success || !res.data) {
          throw new Error(res.error || "Failed to load service details");
        }
        setService(res.data);
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Failed to load service details");
        router.push("/admin/services");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [serviceId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  if (!service) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "CONFIRMED":
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800 border-blue-200";
      case "PENDING":
      case "OPEN": return "bg-amber-100 text-amber-800 border-amber-200";
      case "CANCELLED":
      case "CANCELLED_BY_CLIENT":
      case "CANCELLED_BY_WORKER":
      case "EXPIRED": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Group slots by date
  const slotsByDate: Record<string, string[]> = {};
  if (service.selectedSlots) {
      service.selectedSlots.forEach(slot => {
          const dateStr = new Date(slot.date).toLocaleDateString("en-US", {
              weekday: "short", month: "short", day: "numeric", year: "numeric"
          });
          if (!slotsByDate[dateStr]) slotsByDate[dateStr] = [];
          slotsByDate[dateStr].push(slot.slotType.replace("_", " "));
      });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 pt-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/admin/services")}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight capitalize">
                {service.category} Service
              </h1>
            </div>
            <p className="text-sm text-gray-500 font-mono mt-1 flex items-center gap-2">
              <span className="text-gray-400">ID:</span> {service.serviceId}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(service.status)}`}>
            {service.status.replace(/_/g, " ")}
          </div>
          <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
            service.paymentStatus === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-700 border-gray-200'
          }`}>
            <CreditCard size={14} className="inline mr-1.5 mb-0.5" />
            {service.paymentStatus}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Main Column - Details & Schedule */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Service Title & Description (if exists) */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-3xl"></div>
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-6">
              <FileText className="text-blue-500" size={20} />
              Service Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Title</p>
                <p className="text-xl font-bold text-gray-800">{service.title || "No specific title provided"}</p>
              </div>
              
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <AlignLeft size={16} /> Description
                </p>
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {service.description || "No description provided by the client."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scheduling Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-3xl"></div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Calendar className="text-indigo-500" size={20} />
                Scheduling Information
              </h2>
              {service.numberOfDays && (
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-bold border border-indigo-100">
                  {service.numberOfDays} Day{service.numberOfDays > 1 ? 's' : ''} Duration
                </span>
              )}
            </div>
            
            <div className="space-y-4">
              {Object.keys(slotsByDate).length > 0 ? (
                Object.entries(slotsByDate).map(([date, slots], idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm">
                        <Calendar size={18} />
                      </div>
                      <span className="font-semibold text-gray-800 text-lg">{date}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      {slots.map((slot, sIdx) => (
                        <span key={sIdx} className="bg-white text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm">
                          <Clock size={16} className="text-indigo-400" />
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  No explicit slots selected.
                </div>
              )}
            </div>
          </div>
          
        </div>

        {/* Right Column - Users & Location */}
        <div className="space-y-8">
          
          {/* Client Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100 group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-0.5">Client</h3>
                <p className="text-lg font-bold text-gray-900 leading-tight">{service.client.name}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900 truncate max-w-[150px]" title={service.client.email}>{service.client.email}</span>
              </div>
              {service.client.phone && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900">{service.client.phone}</span>
                </div>
              )}
              {/* Client Address */}
              <div className="pt-3 border-t border-gray-100">
                <span className="text-gray-500 text-sm flex items-center gap-1 mb-2">
                  <Home size={14} /> Registered Address
                </span>
                <p className="text-sm font-medium text-gray-800 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  {typeof service.client.address === 'string' 
                    ? service.client.address 
                    : service.client.address && typeof service.client.address === 'object'
                      ? [
                          (service.client.address as { street?: string }).street,
                          (service.client.address as { city?: string }).city,
                          (service.client.address as { state?: string }).state,
                          (service.client.address as { country?: string }).country,
                          (service.client.address as { zip?: string }).zip
                        ].filter(Boolean).join(', ')
                      : "No address on file"}
                </p>
              </div>
            </div>
          </div>

          {/* Worker Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100 group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-0.5">Worker</h3>
                <p className="text-lg font-bold text-gray-900 leading-tight">{service.worker.name}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">User ID</span>
                <span className="font-mono text-xs text-gray-500">{service.worker.userId.substring(0,8)}...</span>
              </div>
            </div>
          </div>

          {/* Service Location */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold border border-orange-100">
                  <MapPin size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Service Location</h3>
             </div>
             
             <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
               <span className="text-xs text-gray-500 uppercase tracking-wider font-bold block mb-1">Coordinates</span>
               <p className="text-gray-700 font-mono text-sm break-all">
                  {service.location.coordinates[1]}, {service.location.coordinates[0]}
               </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminServiceDetailsPage;
