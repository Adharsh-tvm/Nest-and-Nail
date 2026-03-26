"use client";

import React, { useEffect, useState } from "react";
import { getActiveWorkerServiceAction } from "@/app/actions/worker/service-actions";
import { ServiceResponseDTO, SlotType } from "@/shared/types/serviceTypes";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CreditCard, Tag, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function OngoingServicePage() {
  const [activeService, setActiveService] = useState<ServiceResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveService = async () => {
      try {
        const response = await getActiveWorkerServiceAction();
        if (response.success && response.data) {
          setActiveService(response.data);
        } else if (!response.success && response.error) {
          // toast.error(response.error);
        }
      } catch (error) {
        toast.error("Failed to load active service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveService();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatSlotType = (slotType: string) => {
    switch (slotType) {
      case SlotType.MORNING_HALF:
        return "Morning Shift";
      case SlotType.EVENING_HALF:
        return "Evening Shift";
      case SlotType.FULL_DAY:
        return "Full Day";
      default:
        return slotType;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 relative min-h-[calc(100vh-80px)]">
      <div className="absolute top-0 left-0 w-full h-64 bg-emerald-50/50 -z-10 rounded-b-[3rem] blur-xl" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Active Assignment</h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">Manage your currently ongoing service</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm"
          >
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Fetching active service...</p>
          </motion.div>
        ) : activeService ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
            className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100 overflow-hidden"
          >
            <div className="bg-emerald-600 px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/30 p-2 rounded-xl backdrop-blur-md">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-xl">Service In Progress</h2>
                    <p className="text-emerald-100 text-sm mt-0.5">Reference: {activeService.serviceId.substring(0, 8).toUpperCase()}</p>
                  </div>
                </div>
              </div>
              <div className="relative z-10 py-1.5 px-4 bg-emerald-700/50 backdrop-blur-md rounded-full text-white text-sm font-medium flex items-center gap-2 border border-emerald-500/30 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {activeService.status}
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-100 transition-colors hover:bg-emerald-50/50 group"
                >
                  <div className="flex items-center gap-3 text-slate-500 mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                      <Tag className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium uppercase tracking-wider">Category</span>
                  </div>
                  <p className="text-slate-800 font-semibold text-lg">{activeService.category}</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-100 transition-colors hover:bg-emerald-50/50 group"
                >
                  <div className="flex items-center gap-3 text-slate-500 mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium uppercase tracking-wider">Date</span>
                  </div>
                  <p className="text-slate-800 font-semibold text-lg">{formatDate(activeService.scheduledDate)}</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-100 transition-colors hover:bg-emerald-50/50 group col-span-1 md:col-span-2 lg:col-span-1"
                >
                  <div className="flex items-center gap-3 text-slate-500 mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium uppercase tracking-wider">Shift</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {activeService.selectedSlots.length > 0 ? (
                      activeService.selectedSlots.map((slot, index) => (
                        <p key={index} className="text-slate-800 font-semibold text-lg hover:text-emerald-600 transition-colors line-clamp-1">
                          {formatSlotType(slot.slotType)}
                        </p>
                      ))
                    ) : (
                      <p className="text-slate-800 font-semibold text-lg">Not specified</p>
                    )}
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-100 transition-colors hover:bg-emerald-50/50 group"
                >
                  <div className="flex items-center gap-3 text-slate-500 mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium uppercase tracking-wider">Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${activeService.paymentStatus === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <p className="text-slate-800 font-semibold text-lg">{activeService.paymentStatus}</p>
                  </div>
                </motion.div>
              </div>

              {/* Decorative abstract elements */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                <p className="text-sm text-slate-400 font-medium">Created {formatDate(activeService.createdAt)}</p>
                <div className="flex items-center gap-3">
                  <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all active:scale-95 shadow-sm">
                    View Client Details
                  </button>
                  <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95">
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
              <AlertCircle className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Active Assignments</h3>
            <p className="text-slate-500 max-w-sm text-center">You currently don't have any ongoing services. When a service begins, it will appear here.</p>
            <button className="mt-8 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all shadow-md active:scale-95">
              View All Services
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}