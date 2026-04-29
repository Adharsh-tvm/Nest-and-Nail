"use client";

import { useState, useTransition } from "react";
import {
  MessageSquareWarning,
  X,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import { raiseConcernAction } from "@/app/actions/concern-actions";

interface RaiseConcernButtonProps {
  serviceId: string;
}

export default function RaiseConcernButton({ serviceId }: RaiseConcernButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_CHARS = 1000;

  const resetAndClose = () => {
    if (isPending) return;
    setShowModal(false);
    setMessage("");
    setError(null);
    setDone(false);
  };

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error("Please describe your concern.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await raiseConcernAction(serviceId, message.trim());
      if (res.success) {
        setDone(true);
        toast.success("Concern raised successfully. Our team will review it.");
      } else {
        setError(res.error || "Failed to raise concern. Please try again.");
      }
    });
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        id="raise-concern-btn"
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-sm transition-all active:scale-95"
      >
        <MessageSquareWarning className="w-4 h-4" />
        Raise a Concern
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.72)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

            <div className="p-8">
              {done ? (
                /* ── Success ── */
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">Concern Submitted</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Your concern has been recorded. Our support team will review it shortly.
                    </p>
                  </div>
                  <button
                    onClick={resetAndClose}
                    className="mt-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-700 transition-all"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                        <MessageSquareWarning className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 leading-tight">
                          Raise a Concern
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Describe the issue with this completed service
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={resetAndClose}
                      disabled={isPending}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Info banner */}
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Concerns can only be raised for <strong>completed</strong> services. Provide as
                      much detail as possible so our team can resolve the issue quickly.
                    </p>
                  </div>

                  {/* Textarea */}
                  <div className="mb-5">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Describe your concern <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => {
                        if (e.target.value.length <= MAX_CHARS) setMessage(e.target.value);
                      }}
                      placeholder="What went wrong? Include relevant details about the service…"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 resize-none transition-all"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Be specific — vague concerns may take longer to resolve
                      </span>
                      <span
                        className={`text-[10px] font-medium ${
                          message.length > MAX_CHARS * 0.9
                            ? "text-red-400"
                            : "text-slate-400"
                        }`}
                      >
                        {message.length}/{MAX_CHARS}
                      </span>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
                      {error}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={resetAndClose}
                      disabled={isPending}
                      className="flex-1 py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-40"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isPending || !message.trim()}
                      className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-amber-200/50 flex items-center justify-center gap-2"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Concern
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
