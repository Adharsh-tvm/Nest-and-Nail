"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Calendar, Clock, MapPin, Phone, Mail, FileText, CreditCard,
  CheckCircle2, Briefcase, User, Loader2, AlertTriangle, XCircle
} from "lucide-react";
import { ServiceResponseDTO, ServiceStatus, PaymentStatus } from "@/shared/types/serviceTypes";
import { getClientServiceByIdAction, cancelServiceAction } from "@/app/actions/client/service-actions";
import { getWorkerDetailAction } from "@/app/actions/client/view-worker-actions";
import clsx from "clsx";
import toast from "react-hot-toast";
import RaiseConcernButton from "@/app/components/containers/services/RaiseConcernButton";
import AddReviewButton from "@/app/components/containers/services/AddReviewButton";

// ── Refund tier helper (mirrors backend) ──────────────────────────────────────
function getRefundInfo(createdAt: Date | string) {
  const diffMs  = Date.now() - new Date(createdAt).getTime();
  const diffMin = diffMs / (1000 * 60);
  const diffHr  = diffMs / (1000 * 60 * 60);

  if (diffHr > 6)   return { canCancel: false, refundPct: 0,   label: "Not Cancellable",  color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    explanation: "The 6-hour cancellation window has expired." };
  if (diffMin < 15)  return { canCancel: true,  refundPct: 100, label: "Full Refund (100%)", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", explanation: "Within 15 min of booking — full refund to your wallet." };
  if (diffHr < 1)   return { canCancel: true,  refundPct: 90,  label: "90% Refund",        color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   explanation: "Within 1 hour of booking — 90% refund to your wallet." };
  return                   { canCancel: true,  refundPct: 50,  label: "50% Refund",        color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200",  explanation: "Between 1–6 hours from booking — 50% refund to your wallet." };
}

export default function ClientServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.serviceId as string;

  const [service, setService] = useState<ServiceResponseDTO | null>(null);
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Cancellation State
  const [cancelModal, setCancelModal] = useState<{ open: boolean; reason: string; loading: boolean }>({ open: false, reason: "", loading: false });

  useEffect(() => {
    const fetchDetailedService = async () => {
      if (!serviceId) return;
      try {
        setLoading(true);
        const response = await getClientServiceByIdAction(serviceId);
        if (response.success && response.data) {
          setService(response.data);
          // Fetch worker details if we have workerId
          if (response.data.workerId) {
             const wRes = await getWorkerDetailAction(response.data.workerId);
             if (wRes.success) {
                 setWorker(wRes.data);
             }
          }
        } else {
          toast.error(response.error || "Failed to load service details.");
        }
      } catch {
        toast.error("An unexpected error occurred while fetching details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetailedService();
  }, [serviceId]);

  const handleCancelService = async () => {
      if (!cancelModal.reason.trim()) {
          toast.error("Reason is required");
          return;
      }
      const refund = getRefundInfo(service?.createdAt ?? new Date());
      if (!refund.canCancel) {
          toast.error("Cancellation window has expired. Cannot cancel after 6 hours.");
          return;
      }
      setCancelModal(prev => ({ ...prev, loading: true }));
      const res = await cancelServiceAction(serviceId, cancelModal.reason);
      if (res.success) {
          toast.success("Service cancelled successfully");
          setService(prev => prev ? { ...prev, status: ServiceStatus.CANCELLED_BY_CLIENT } : prev);
          setCancelModal({ open: false, reason: "", loading: false });
      } else {
          toast.error(res.error || "Failed to cancel service");
          setCancelModal(prev => ({ ...prev, loading: false }));
      }
  };

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case ServiceStatus.COMPLETED:   return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case ServiceStatus.IN_PROGRESS: return "bg-blue-100 text-blue-800 border-blue-200";
      case ServiceStatus.CANCELLED:
      case ServiceStatus.CANCELLED_BY_CLIENT:
      case ServiceStatus.CANCELLED_BY_WORKER: return "bg-red-100 text-red-800 border-red-200";
      case ServiceStatus.PENDING:     return "bg-amber-100 text-amber-800 border-amber-200";
      case ServiceStatus.CONFIRMED:   return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:                        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-md" />
        <p className="text-gray-500 font-medium">Loading service details…</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Not Found</h2>
          <p className="text-gray-500 mb-6">We couldn't locate the details for this service.</p>
          <button
            onClick={() => router.back()}
            className="w-full inline-flex justify-center items-center py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const isCancellable = ["PENDING", "CONFIRMED"].includes(service.status);

  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-3 flex-wrap">
            <button onClick={() => router.back()} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 bg-white/50 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm transition-all hover:bg-white">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </button>
            <div className="flex items-center gap-3">
              <span className={clsx("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border", getStatusColor(service.status))}>
                {service.status.replace(/_/g, " ")}
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-16" />
                <div className="p-5 flex flex-col items-center relative">
                  <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center -mt-14 mb-3 overflow-hidden">
                    {worker?.profileImageUrl || worker?.profilePictureUrl ? (
                      <img src={(worker.profileImageUrl || worker.profilePictureUrl).startsWith('http') ? (worker.profileImageUrl || worker.profilePictureUrl) : `${process.env.NEXT_PUBLIC_API_URL}/${(worker.profileImageUrl || worker.profilePictureUrl).replace(/^\//, '')}`} alt={worker?.name || "Worker"} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 text-center">{worker?.name || "Loading worker..."}</h3>
                  <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-4">Assigned Worker</p>
                  <div className="w-full space-y-3 pt-4 border-t border-gray-100">
                    {worker?.email && (
                      <div className="flex items-start space-x-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-gray-600 break-all">{worker.email}</span>
                      </div>
                    )}
                    {worker?.phone && (
                      <div className="flex items-center space-x-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{worker.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Location Display */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                <div className="flex items-center space-x-2 text-gray-900 font-semibold mb-2">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                  <h3>Service Location</h3>
                </div>
                {service.address ? (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm text-gray-600">
                    <p className="font-semibold text-gray-900">{service.address.label || "Address"}</p>
                    <p>{service.address.street}, {service.address.city}</p>
                    <p>{service.address.state} - {service.address.zip}</p>
                  </div>
                ) : service.location?.coordinates ? (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm text-center">
                         <p className="text-gray-600">Coordinates Provided</p>
                         <p className="text-xs font-mono text-gray-500 mt-1">{service.location.coordinates[1].toFixed(6)}, {service.location.coordinates[0].toFixed(6)}</p>
                    </div>
                ) : (
                  <p className="text-sm text-gray-500 italic text-center py-4">No location provided.</p>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase rounded-md border border-emerald-100">{service.category}</span>
                      {service.paymentStatus === PaymentStatus.SUCCESS && (
                        <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">{service.title || `Service: ${service.category}`}</h1>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6 space-y-1">
                  <div className="flex items-center text-sm font-semibold text-gray-900 mb-2"><FileText className="w-4 h-4 mr-2 text-blue-500" />Description</div>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{service.description || "No description provided."}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 p-4 rounded-xl border border-gray-100 bg-white">
                    <div className="p-2 bg-blue-50 rounded-lg"><Calendar className="w-5 h-5 text-blue-600" /></div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-0.5">Scheduled For</p>
                      <p className="text-sm font-semibold text-gray-900">{new Date(service.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 rounded-xl border border-gray-100 bg-white">
                    <div className="p-2 bg-blue-50 rounded-lg"><Clock className="w-5 h-5 text-blue-600" /></div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-0.5">Duration</p>
                      <p className="text-sm font-semibold text-gray-900">{service.numberOfDays || 1} {service.numberOfDays === 1 ? "Day" : "Days"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 rounded-xl border border-gray-100 bg-white sm:col-span-2">
                    <div className="p-2 bg-blue-50 rounded-lg"><Briefcase className="w-5 h-5 text-blue-600" /></div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-2">Selected Slots</p>
                      <div className="flex flex-wrap gap-2">
                        {service.selectedSlots?.map((slot, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                            {new Date(slot.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} &bull; {slot.slotType.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" /> Payment Summary
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Rate (Per worker/day)</span>
                      <span className="font-medium">₹{service.pricePerWorker || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Workers × Days</span>
                      <span className="font-medium">{service.numberOfWorkers || 1} × {service.numberOfDays || 1}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Platform Fee</span>
                      <span className="font-medium">₹50</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total Amount Paid</span>
                      <span className="text-emerald-600">₹{service.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {isCancellable && (
                   <div className="mt-6 pt-6 border-t border-gray-100">
                       <button onClick={() => setCancelModal({ open: true, reason: "", loading: false })} className="w-full flex justify-center items-center gap-2 py-3.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-colors border border-red-200">
                           <XCircle className="w-4 h-4"/> Cancel Service
                       </button>
                   </div>
                )}

                {/* Actions after completion */}
                {service.status === ServiceStatus.COMPLETED && (
                  <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
                    <RaiseConcernButton serviceId={serviceId} />
                    <AddReviewButton serviceId={serviceId} />
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <span>Payment Status: <strong className={service.paymentStatus === PaymentStatus.SUCCESS ? "text-emerald-600" : "text-amber-600"}>{service.paymentStatus}</strong></span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-gray-400 uppercase font-semibold mb-1 tracking-wider">Created</p>
                    <p className="font-medium text-gray-800">{new Date(service.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  {service.startedAt && (
                    <div>
                      <p className="text-gray-400 uppercase font-semibold mb-1 tracking-wider">Started</p>
                      <p className="font-medium text-gray-800">{new Date(service.startedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  )}
                  {service.completedAt && (
                    <div>
                      <p className="text-gray-400 uppercase font-semibold mb-1 tracking-wider">Completed</p>
                      <p className="font-medium text-gray-800">{new Date(service.completedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  )}
                  {service.updatedAt && (
                    <div>
                      <p className="text-gray-400 uppercase font-semibold mb-1 tracking-wider">Updated</p>
                      <p className="font-medium text-gray-800">{new Date(service.updatedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {cancelModal.open && service && (() => {
        const refund = getRefundInfo(service.createdAt);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="text-red-500 w-5 h-5" /> Cancel Service
                  </h3>

                  {/* Refund Policy Badge */}
                  <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 mb-4 ${refund.bg} ${refund.border}`}>
                      <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${refund.color}`} />
                      <div>
                          <p className={`text-xs font-extrabold uppercase tracking-wide ${refund.color}`}>
                              Refund Policy · {refund.label}
                          </p>
                          <p className={`text-xs mt-0.5 leading-relaxed ${refund.color}`}>
                              {refund.explanation}
                          </p>
                          {!refund.canCancel && (
                              <p className="mt-1 text-xs font-bold text-red-600">
                                  ⛔ Cancellation is no longer available.
                              </p>
                          )}
                      </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">Please provide a reason for cancellation.</p>
                  <textarea
                      value={cancelModal.reason}
                      onChange={(e) => setCancelModal(prev => ({ ...prev, reason: e.target.value }))}
                      disabled={!refund.canCancel}
                      placeholder={refund.canCancel ? "Reason for cancellation..." : "Cancellation window has expired"}
                      className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                      rows={4}
                  />
                  <div className="flex gap-3">
                      <button onClick={() => setCancelModal({ open: false, reason: "", loading: false })} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm">Keep Service</button>
                      <button
                          onClick={handleCancelService}
                          disabled={cancelModal.loading || !refund.canCancel}
                          className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {cancelModal.loading && <Loader2 className="w-4 h-4 animate-spin" />} Cancel
                      </button>
                  </div>
              </div>
          </div>
        );
      })()}
    </>
  );
}
