"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { XCircle, AlertTriangle, X, Loader2, CheckCircle2, RotateCcw, Info } from "lucide-react";
import toast from "react-hot-toast";

interface CancelMeetingButtonProps {
  serviceId: string;
  category: string;
  scheduledDate: string;
  createdAt: string;
  cancelServiceAction: (serviceId: string, reason: string) => Promise<{ success: boolean; error?: string }>;
}

// ── Refund tier helper (mirrors backend logic) ──────────────────────────────
function getRefundInfo(createdAt: string): {
  canCancel: boolean;
  refundPct: number;
  label: string;
  color: string;
  bg: string;
  border: string;
  explanation: string;
} {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMin = diffMs / (1000 * 60);
  const diffHr  = diffMs / (1000 * 60 * 60);

  if (diffHr > 6) {
    return {
      canCancel: false,
      refundPct: 0,
      label: "Not Cancellable",
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      explanation: "The 6-hour cancellation window has expired. This booking can no longer be cancelled.",
    };
  }
  if (diffMin < 15) {
    return {
      canCancel: true,
      refundPct: 100,
      label: "Full Refund (100%)",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      explanation: "You are within 15 minutes of booking. You will receive a full refund to your wallet.",
    };
  }
  if (diffHr < 1) {
    return {
      canCancel: true,
      refundPct: 90,
      label: "90% Refund",
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
      explanation: "You are within 1 hour of booking. You will receive a 90% refund to your wallet.",
    };
  }
  return {
    canCancel: true,
    refundPct: 50,
    label: "50% Refund",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    explanation: "You are between 1–6 hours from booking. You will receive a 50% refund to your wallet.",
  };
}

export default function CancelMeetingButton({
  serviceId,
  category,
  scheduledDate,
  createdAt,
  cancelServiceAction,
}: CancelMeetingButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<"reason" | "confirm">("reason");
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const refund = getRefundInfo(createdAt);

  const handleOpen = () => {
    setShowModal(true);
    setStep("reason");
    setReason("");
    setError(null);
    setDone(false);
  };

  const handleNext = () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for cancellation.");
      return;
    }
    setStep("confirm");
  };

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      const result = await cancelServiceAction(serviceId, reason.trim());
      if (result.success) {
        setDone(true);
        toast.success("Meeting cancelled successfully.");
        setTimeout(() => {
          setShowModal(false);
          router.refresh();
        }, 1500);
      } else {
        setError(result.error || "Failed to cancel the meeting. Please try again.");
      }
    });
  };

  const resetAndClose = () => {
    if (isPending) return;
    setShowModal(false);
    setStep("reason");
    setReason("");
    setError(null);
    setDone(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        id="cancel-meeting-btn"
        onClick={handleOpen}
        className="inline-flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 border-2 border-red-100 font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95 shrink-0"
      >
        <XCircle className="w-4 h-4" />
        Cancel Meeting
      </button>

      {/* Cancellation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.7)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-red-400 via-red-500 to-orange-400" />

            <div className="p-8">
              {done ? (
                /* ── Success state ── */
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-lg font-bold text-slate-800">Meeting Cancelled</p>
                  <p className="text-sm text-slate-500 text-center">
                    The meeting has been successfully cancelled.{" "}
                    {refund.refundPct > 0 && (
                      <span className="font-semibold text-emerald-700">
                        A {refund.refundPct}% refund has been credited to your wallet.
                      </span>
                    )}
                  </p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                        {step === "reason" ? (
                          <AlertTriangle className="w-6 h-6 text-red-500" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 leading-tight">
                          {step === "reason" ? "Cancel Meeting" : "Confirm Cancellation"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {step === "reason"
                            ? "Please provide a reason"
                            : "This action cannot be undone"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={resetAndClose}
                      disabled={isPending}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Refund Policy Badge */}
                  <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 mb-5 ${refund.bg} ${refund.border}`}>
                    <Info className={`w-4 h-4 mt-0.5 shrink-0 ${refund.color}`} />
                    <div>
                      <p className={`text-xs font-extrabold uppercase tracking-wide ${refund.color}`}>
                        Refund Policy · {refund.label}
                      </p>
                      <p className={`text-xs mt-0.5 leading-relaxed ${refund.color}`}>
                        {refund.explanation}
                      </p>
                      {!refund.canCancel && (
                        <p className="mt-2 text-xs font-bold text-red-600">
                          ⛔ Cancellation is no longer available for this booking.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Meeting Info pill */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                      Meeting Details
                    </p>
                    <p className="font-bold text-slate-800 text-sm">
                      {category.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatDate(scheduledDate)}
                    </p>
                  </div>

                  {/* ── Step: Reason ── */}
                  {step === "reason" ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Reason for cancellation <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={4}
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          disabled={!refund.canCancel}
                          placeholder={
                            refund.canCancel
                              ? "Please tell us why you're cancelling..."
                              : "Cancellation window has expired"
                          }
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 resize-none transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
                        />
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">
                          {reason.length}/500 characters
                        </p>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={resetAndClose}
                          className="flex-1 py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
                        >
                          Keep Meeting
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={!reason.trim() || !refund.canCancel}
                          className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-red-200/50"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Step: Confirm ── */
                    <div className="space-y-5">
                      <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                        <p className="text-sm font-bold text-red-700 mb-1">Are you sure?</p>
                        <p className="text-xs text-red-600 leading-relaxed">
                          By cancelling, this slot will be released.{" "}
                          <span className="font-semibold">
                            {refund.refundPct > 0
                              ? `₹${refund.refundPct}% of the total amount will be refunded to your wallet.`
                              : "No refund will be issued."}
                          </span>
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                          Your reason:
                        </p>
                        <p className="text-sm text-slate-700 italic font-medium">"{reason}"</p>
                      </div>

                      {error && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
                          {error}
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep("reason")}
                          disabled={isPending}
                          className="flex-1 py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleConfirm}
                          disabled={isPending}
                          className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-red-200/50 flex items-center justify-center gap-2"
                        >
                          {isPending ? (
                            <><RotateCcw className="w-4 h-4 animate-spin" /> Cancelling...</>
                          ) : (
                            <><XCircle className="w-4 h-4" /> Yes, Cancel</>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
