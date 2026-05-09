"use client";

import React, { useEffect, useState } from "react";
import { getWorkerServicesAction } from "@/app/actions/worker/service-actions";
import { ServiceResponseDTO, SlotType, ServiceStatus } from "@/shared/types/serviceTypes";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Calendar as CalendarIcon, Clock, CreditCard, Tag, MoreHorizontal, Filter, Loader2, Search } from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "@/app/components/ui/Pagination";

const PAGE_SIZE = 9;

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | ServiceStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await getWorkerServicesAction();
        if (response.success && response.data) {
          setServices(response.data);
        } else if (!response.success && response.error) {
          toast.error(response.error);
        }
      } catch {
        toast.error("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Reset to page 1 whenever filter/search/tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const formatSlotType = (slotType: string) => {
    switch (slotType) {
      case SlotType.MORNING_HALF: return "Morning";
      case SlotType.EVENING_HALF: return "Evening";
      case SlotType.FULL_DAY: return "Full Day";
      default: return slotType;
    }
  };

  const getStatusColor = (status: ServiceStatus | string) => {
    switch (status) {
      case ServiceStatus.COMPLETED: return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case ServiceStatus.IN_PROGRESS: return "bg-blue-100 text-blue-800 border-blue-200";
      case ServiceStatus.CONFIRMED: return "bg-violet-100 text-violet-800 border-violet-200";
      case ServiceStatus.PENDING: return "bg-amber-100 text-amber-800 border-amber-200";
      case ServiceStatus.CANCELLED:
      case ServiceStatus.CANCELLED_BY_CLIENT:
      case ServiceStatus.CANCELLED_BY_WORKER:
        return "bg-rose-100 text-rose-800 border-rose-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  // Filter by tab + search
  const filteredServices = services
    .filter(s => activeTab === "ALL" || s.status === activeTab)
    .filter(s => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.category.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q) ||
        s.serviceId.toLowerCase().includes(q)
      );
    });

  const totalPages = Math.ceil(filteredServices.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const pagedServices = filteredServices.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const tabs = [
    { id: "ALL", label: "All Services" },
    { id: ServiceStatus.PENDING, label: "Pending" },
    { id: ServiceStatus.CONFIRMED, label: "Confirmed" },
    { id: ServiceStatus.IN_PROGRESS, label: "In Progress" },
    { id: ServiceStatus.COMPLETED, label: "Completed" },
    { id: ServiceStatus.CANCELLED, label: "Cancelled" },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Service History</h1>
          {!loading && (
            <p className="text-sm text-slate-400 mt-1">
              {filteredServices.length} service{filteredServices.length !== 1 ? "s" : ""}
              {totalPages > 1 && ` · page ${safePage} of ${totalPages}`}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="relative max-w-sm w-full"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all sm:text-sm shadow-sm"
            placeholder="Search by category or status..."
          />
        </motion.div>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex overflow-x-auto pb-2 mb-8 hide-scrollbar border-b border-slate-200"
      >
        <div className="flex gap-6 min-w-max px-1">
          {tabs.map((tab) => {
            const count = tab.id === "ALL"
              ? services.length
              : services.filter(s => s.status === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "ALL" | ServiceStatus)}
                className={`pb-4 px-1 text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
                  activeTab === tab.id ? "text-emerald-600" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.id
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading services...</p>
        </div>
      ) : pagedServices.length > 0 ? (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {pagedServices.map((service) => (
              <motion.div
                key={service.serviceId}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <Tag className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">{service.category}</h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">#{service.serviceId.substring(0, 8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-center gap-3 text-slate-600">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium">{formatDate(service.scheduledDate)}</span>
                  </div>

                  <div className="flex items-start gap-3 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div className="flex flex-wrap gap-1 text-sm font-medium">
                      {service.selectedSlots.length > 0 ? (
                        service.selectedSlots.map((slot, i) => (
                          <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs">
                            {formatSlotType(slot.slotType)}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500">TBD</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium">{service.paymentStatus}</span>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(service.status)}`}>
                    {service.status.replace(/_/g, " ")}
                  </span>
                  <Link
                    href={`/worker/services/${service.serviceId}`}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300"
        >
          <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100 mb-4">
            <Filter className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No Services Found</h3>
          <p className="text-slate-500 mt-1 max-w-sm text-center">
            {searchQuery ? `No results for "${searchQuery}"` : "There are no services matching the current filter criteria."}
          </p>
          {(activeTab !== "ALL" || searchQuery) && (
            <button
              onClick={() => { setActiveTab("ALL"); setSearchQuery(""); }}
              className="mt-6 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}