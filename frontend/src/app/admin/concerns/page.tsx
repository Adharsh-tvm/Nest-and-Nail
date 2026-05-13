"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  MessageSquareWarning,
  User,
  Mail,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  X,
  Briefcase,
  ShieldAlert,
  ShieldCheck,
  UserMinus,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import { AdminConcern } from "@/sources/api/admin/admin.api";
import { getAllConcernsAction, toggleUserSuspensionAction, resolveConcernAction } from "@/app/actions/admin/admin-actions";
import Pagination from "@/app/components/ui/Pagination";
import Image from "next/image";

export default function AdminConcernsPage() {
  const [concerns, setConcerns] = useState<AdminConcern[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // UI state for expansions and media previews
  const [expandedConcernId, setExpandedConcernId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [suspendingId, setSuspendingId] = useState<string | null>(null);

  // Resolution states
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState("");
  const [submittingResolution, setSubmittingResolution] = useState(false);

  const handleSubmitResolution = async (concernId: string) => {
    if (!resolutionText.trim()) {
      toast.error("Resolution message is required");
      return;
    }

    try {
      setSubmittingResolution(true);
      const res = await resolveConcernAction(concernId, resolutionText);
      if (res.success) {
        toast.success("Concern resolved successfully");
        setResolvingId(null);
        setResolutionText("");
        loadConcerns();
      } else {
        toast.error(res.error || "Failed to resolve concern");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmittingResolution(false);
    }
  };

  const handleToggleSuspension = async (userId: string, durationDays: number, userName: string) => {
    try {
      setSuspendingId(userId);
      const isSuspending = durationDays > 0;
      const res = await toggleUserSuspensionAction(userId, durationDays);
      if (res.success) {
        toast.success(
          isSuspending 
            ? `${userName} has been suspended for ${durationDays} days.` 
            : `${userName} suspension has been lifted.`
        );
        loadConcerns();
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSuspendingId(null);
    }
  };



  const ITEMS_PER_PAGE = 4;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
      setCurrentPage(1); // Reset to page 1 on search
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const loadConcerns = useCallback(async () => {
    try {
      setLoading(true);
      const filterStatus = statusFilter === "ALL" ? undefined : statusFilter;
      
      const res = await getAllConcernsAction({
        status: filterStatus,
        search: searchQuery || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });

      if (res.success && res.payload) {
        setConcerns(res.payload.concerns);
        setTotalCount(res.payload.total);
        setTotalPages(res.payload.totalPages);
      } else {
        toast.error(res.error || "Failed to fetch concerns");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch concerns");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, currentPage]);

  // Trigger loading on changes
  useEffect(() => {
    loadConcerns();
  }, [loadConcerns]);

  const toggleExpand = (id: string) => {
    setExpandedConcernId((prev) => (prev === id ? null : id));
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status.toUpperCase();
    if (s === "PENDING") {
      return "bg-amber-50 text-amber-700 border-amber-200/60";
    }
    if (s === "RESOLVED" || s === "COMPLETED") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    }
    return "bg-slate-50 text-slate-700 border-slate-200/60";
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1B4332] tracking-tight">
            Customer concerns
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review service complaints, details, and attachments filed by clients or workers
          </p>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
              Total Concerns Raised
            </p>
            <h3 className="text-3xl font-black text-gray-800">{totalCount}</h3>
            <p className="text-xs text-gray-400 mt-2">Active in filters</p>
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <MessageSquareWarning size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
              Pending Actions
            </p>
            <h3 className="text-3xl font-black text-amber-600">
              {concerns.filter(c => c.status.toUpperCase() === "PENDING").length}
            </h3>
            <p className="text-xs text-amber-600/70 font-semibold mt-2">Requires review</p>
          </div>
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center animate-pulse">
            <AlertTriangle size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
              Resolved Cases
            </p>
            <h3 className="text-3xl font-black text-emerald-600">
              {concerns.filter(c => c.status.toUpperCase() === "RESOLVED").length}
            </h3>
            <p className="text-xs text-emerald-600/70 font-semibold mt-2 flex items-center gap-1">
              <CheckCircle size={12} /> Solved completely
            </p>
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <CheckCircle size={28} />
          </div>
        </div>
      </div>

      {/* Main Filter & Search Control Bar */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xl shadow-gray-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by names, emails, messages..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-150 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-800"
          />
        </div>

        {/* Status Filters */}
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-150 self-start md:self-auto gap-1">
          {["ALL", "PENDING", "RESOLVED"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                statusFilter === status
                  ? "bg-white text-gray-900 shadow-md shadow-slate-200/50 scale-105"
                  : "text-gray-400 hover:text-gray-700 hover:bg-white/40"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Concerns Display Feed */}
      {loading ? (
        /* Skeleton / Loading state */
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-3xl p-8 space-y-4 animate-pulse shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-24" />
                    <div className="h-3 bg-gray-100 rounded w-16" />
                  </div>
                </div>
                <div className="h-7 bg-gray-100 rounded-full w-20" />
              </div>
              <div className="h-12 bg-gray-50 rounded-2xl w-full" />
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl" />
                <div className="w-20 h-20 bg-gray-100 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      ) : concerns.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center bg-white border border-dashed border-gray-200 rounded-[2rem] p-16 text-center shadow-inner">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">All Clear!</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            There are currently no customer concern records matching the filters.
          </p>
        </div>
      ) : (
        /* List Feed */
        <div className="space-y-6">
          {concerns.map((concern) => {
            const isExpanded = expandedConcernId === concern._id;
            const dateStr = concern.createdAt
              ? new Date(concern.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Unknown Date";

            return (
              <div
                key={concern._id}
                className="bg-white border border-gray-150/80 rounded-2xl shadow-md shadow-gray-100/30 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200"
              >
                {/* Accent Banner based on status */}
                <div
                  className={`h-1 w-full bg-gradient-to-r ${
                    concern.status.toUpperCase() === "PENDING"
                      ? "from-amber-400 to-orange-400"
                      : "from-emerald-400 to-teal-400"
                  }`}
                />

                <div className="p-4 sm:p-5 space-y-4">
                  {/* Top Line: User raised & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-inner">
                        <User className="w-4.5 h-4.5 text-slate-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm leading-none">
                            {concern.raisedByName || "Anonymous"}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[9px] font-bold uppercase tracking-wider border border-slate-200/60">
                            {concern.raisedBy}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-1 font-medium">
                          <Mail className="w-3 h-3" /> {concern.raisedByEmail || "—"}
                          <span className="text-gray-300">•</span>
                          <Clock className="w-3 h-3" /> {dateStr}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusBadgeClass(
                          concern.status
                        )}`}
                      >
                        {concern.status}
                      </span>
                    </div>
                  </div>

                  {/* Compact Service Reference Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60 p-3 px-4 rounded-xl border border-slate-100 text-[11px] text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-gray-800 text-xs">{concern.serviceName || "Untitled Service"}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-bold text-gray-700">₹{concern.serviceAmount || "—"}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-bold text-gray-755">
                          {concern.serviceScheduledDate
                            ? new Date(concern.serviceScheduledDate).toLocaleDateString()
                            : "—"}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Complaint Description Message */}
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Concern details & statement
                    </h5>
                    <div className="p-3.5 rounded-xl bg-amber-50/10 border border-amber-200/20 text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {concern.message}
                    </div>
                  </div>

                  {/* Attachments Section */}
                  {concern.images && concern.images.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Image attachments ({concern.images.length})
                      </h5>
                      <div className="flex flex-wrap gap-3">
                        {concern.images.map((imgUrl, i) => (
                          <div
                            key={i}
                            onClick={() => setLightboxImage(imgUrl)}
                            className="group relative w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden cursor-zoom-in hover:scale-105 active:scale-95 shadow-sm transition-all duration-300 shrink-0"
                          >
                            <Image
                              src={imgUrl}
                              alt={`Concern attachment ${i + 1}`}
                              fill
                              unoptimized
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 flex items-center justify-center transition-colors">
                              <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transform translate-y-1.5 group-hover:translate-y-0 transition-all duration-300" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Toggle Expander */}
                  <button
                    onClick={() => toggleExpand(concern._id)}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-150 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        Hide Participant & Complete Details <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        View Client, Worker, & Full Service Details <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Resolution Section */}
                  {concern.status.toUpperCase() === "RESOLVED" ? (
                    concern.resolutionMessage && (
                      <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Resolution Details</span>
                        </div>
                        <p className="text-xs text-emerald-700 font-medium whitespace-pre-wrap bg-white/60 p-3 rounded-lg border border-emerald-150/40">
                          {concern.resolutionMessage}
                        </p>
                        <div className="text-[10px] text-emerald-600/80 flex justify-between items-center font-medium mt-1">
                          <span>Resolved By: {concern.resolvedBy || "ADMIN"}</span>
                          <span>
                            {concern.resolvedAt
                              ? new Date(concern.resolvedAt).toLocaleString()
                              : "—"}
                          </span>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="pt-2">
                      {resolvingId === concern._id ? (
                        <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-150 animate-in slide-in-from-top-2 duration-200">
                          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Describe resolution message (required)
                          </label>
                          <textarea
                            value={resolutionText}
                            onChange={(e) => setResolutionText(e.target.value)}
                            placeholder="Describe how this customer's concern was resolved, any actions taken, or refund outcomes..."
                            rows={3}
                            className="w-full p-3 rounded-xl border border-gray-150 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-800 font-medium"
                          />
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => {
                                setResolvingId(null);
                                setResolutionText("");
                              }}
                              className="px-4 py-2 hover:bg-slate-100 border border-slate-250 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSubmitResolution(concern._id)}
                              disabled={submittingResolution || !resolutionText.trim()}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-xl text-xs font-black tracking-wider transition-all shadow-md shadow-emerald-100 flex items-center gap-1.5"
                            >
                              {submittingResolution ? (
                                <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              Mark as Resolved
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setResolvingId(concern._id);
                            setResolutionText("");
                          }}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center gap-1.5 text-xs font-black tracking-wider transition-colors shadow-lg shadow-emerald-100 hover:scale-[1.01] active:scale-95"
                        >
                          <CheckCircle className="w-4.5 h-4.5" /> Resolve Concern
                        </button>
                      )}
                    </div>
                  )}

                  {/* Expanded block containing every single other detail */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 pt-6 animate-in slide-in-from-top-4 duration-300 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Client Details Box */}
                        <div className="p-5 rounded-2xl bg-white border border-gray-150 space-y-4 shadow-sm flex flex-col justify-between">
                          <div className="space-y-3">
                            <h6 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                              <User className="w-4 h-4" /> Client Information
                            </h6>
                            <div className="space-y-1">
                              <p className="text-sm font-extrabold text-gray-800">
                                {concern.clientName || "—"}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3.5 h-3.5" /> {concern.clientEmail || "—"}
                              </p>
                            </div>

                            <div className="border-t border-gray-100 pt-2.5 space-y-2">
                              <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                                <span>Concerns against Client:</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                  (concern.clientConcernCount || 0) > 5 
                                    ? "bg-red-100 text-red-700 animate-pulse" 
                                    : "bg-gray-100 text-gray-700"
                                }`}>
                                  {concern.clientConcernCount || 0}
                                </span>
                              </div>

                              {(concern.clientConcernCount || 0) > 5 && (
                                <div className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 p-2.5 rounded-xl text-xs font-bold">
                                  <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
                                  <span>Critical: More than 5 concerns recorded!</span>
                                </div>
                              )}

                              {concern.clientIsSuspended ? (
                                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl space-y-2 text-xs">
                                  <div className="flex items-center gap-1.5 text-rose-700 font-extrabold">
                                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                                    <span>Currently Suspended</span>
                                  </div>
                                  <p className="text-gray-500 font-medium">
                                    Ends: {concern.clientSuspensionEndDate ? new Date(concern.clientSuspensionEndDate).toLocaleDateString() : "—"}
                                  </p>
                                </div>
                              ) : (
                                <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-xl flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                  <span>Active (No suspension)</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {concern.clientId && (
                            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                              {concern.clientIsSuspended ? (
                                <button
                                  onClick={() => handleToggleSuspension(concern.clientId!, 0, concern.clientName || "Client")}
                                  disabled={suspendingId !== null}
                                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-xl text-xs font-black tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-rose-200"
                                >
                                  <UserPlus className="w-4 h-4" /> Lift Suspension
                                </button>
                              ) : (
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={() => handleToggleSuspension(concern.clientId!, 5, concern.clientName || "Client")}
                                    disabled={suspendingId !== null}
                                    className="py-2 px-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-xl text-[11px] font-black tracking-wider transition-all flex items-center justify-center gap-1 shadow-md shadow-amber-100"
                                  >
                                    <UserMinus className="w-3.5 h-3.5" /> Suspend 5 Days
                                  </button>
                                  <button
                                    onClick={() => handleToggleSuspension(concern.clientId!, 7, concern.clientName || "Client")}
                                    disabled={suspendingId !== null}
                                    className="py-2 px-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl text-[11px] font-black tracking-wider transition-all flex items-center justify-center gap-1 shadow-md shadow-red-100"
                                  >
                                    <UserMinus className="w-3.5 h-3.5" /> Suspend 7 Days
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Worker Details Box */}
                        <div className="p-5 rounded-2xl bg-white border border-gray-150 space-y-4 shadow-sm flex flex-col justify-between">
                          <div className="space-y-3">
                            <h6 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                              <User className="w-4 h-4" /> Assigned Worker Information
                            </h6>
                            <div className="space-y-1">
                              <p className="text-sm font-extrabold text-gray-800">
                                {concern.workerName || "—"}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3.5 h-3.5" /> {concern.workerEmail || "—"}
                              </p>
                            </div>

                            <div className="border-t border-gray-100 pt-2.5 space-y-2">
                              <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                                <span>Concerns against Worker:</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                  (concern.workerConcernCount || 0) > 5 
                                    ? "bg-red-100 text-red-700 animate-pulse" 
                                    : "bg-gray-100 text-gray-700"
                                }`}>
                                  {concern.workerConcernCount || 0}
                                </span>
                              </div>

                              {(concern.workerConcernCount || 0) > 5 && (
                                <div className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 p-2.5 rounded-xl text-xs font-bold">
                                  <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
                                  <span>Critical: More than 5 concerns recorded!</span>
                                </div>
                              )}

                              {concern.workerIsSuspended ? (
                                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl space-y-2 text-xs">
                                  <div className="flex items-center gap-1.5 text-rose-700 font-extrabold">
                                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                                    <span>Currently Suspended</span>
                                  </div>
                                  <p className="text-gray-500 font-medium">
                                    Ends: {concern.workerSuspensionEndDate ? new Date(concern.workerSuspensionEndDate).toLocaleDateString() : "—"}
                                  </p>
                                </div>
                              ) : (
                                <div className="bg-blue-50 border border-blue-100 p-2 rounded-xl flex items-center gap-1.5 text-xs text-blue-700 font-semibold">
                                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                                  <span>Active (No suspension)</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {concern.workerId && (
                            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                              {concern.workerIsSuspended ? (
                                <button
                                  onClick={() => handleToggleSuspension(concern.workerId!, 0, concern.workerName || "Worker")}
                                  disabled={suspendingId !== null}
                                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-xl text-xs font-black tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-rose-200"
                                >
                                  <UserPlus className="w-4 h-4" /> Lift Suspension
                                </button>
                              ) : (
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={() => handleToggleSuspension(concern.workerId!, 5, concern.workerName || "Worker")}
                                    disabled={suspendingId !== null}
                                    className="py-2 px-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-xl text-[11px] font-black tracking-wider transition-all flex items-center justify-center gap-1 shadow-md shadow-amber-100"
                                  >
                                    <UserMinus className="w-3.5 h-3.5" /> Suspend 5 Days
                                  </button>
                                  <button
                                    onClick={() => handleToggleSuspension(concern.workerId!, 7, concern.workerName || "Worker")}
                                    disabled={suspendingId !== null}
                                    className="py-2 px-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl text-[11px] font-black tracking-wider transition-all flex items-center justify-center gap-1 shadow-md shadow-red-100"
                                  >
                                    <UserMinus className="w-3.5 h-3.5" /> Suspend 7 Days
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Diagnostic identifiers */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-slate-50/50 rounded-xl text-[10px] font-mono text-gray-400">
                        <span>Concern ID: {concern._id}</span>
                        <span>Service UUID: {concern.serviceId}</span>
                        <span>User UUID: {concern.userId}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}

      {/* Lightbox zoom modal overlay */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.92)", backdropFilter: "blur(10px)" }}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all scale-105"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-3xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
            <Image
              src={lightboxImage}
              alt="Attachment full-size preview"
              width={1200}
              height={800}
              unoptimized
              className="w-auto h-auto max-w-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}