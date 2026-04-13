"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PhoneOff, AlertTriangle, X, Loader2, CheckCircle2 } from "lucide-react";

interface EndMeetingButtonProps {
  serviceId: string;
  videoCallStatus?: string;
  endMeetingAction: (serviceId: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

export default function EndMeetingButton({ serviceId, videoCallStatus, endMeetingAction }: EndMeetingButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Don't show if already ended
  if (videoCallStatus === "ENDED") return null;

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      const result = await endMeetingAction(serviceId);
      if (result.success) {
        setDone(true);
        setTimeout(() => {
          setShowModal(false);
          router.refresh();
        }, 1200);
      } else {
        setError(result.error || "Failed to end the meeting. Please try again.");
      }
    });
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        id="end-meeting-btn"
        onClick={() => { setShowModal(true); setError(null); setDone(false); }}
        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm shadow-rose-500/30 shrink-0"
      >
        <PhoneOff className="w-4 h-4" />
        End Meeting
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.7)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="end-modal-title"
          >
            {/* Top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-rose-400 via-rose-500 to-orange-400" />

            <div className="p-8">
              {done ? (
                /* Success state */
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-lg font-bold text-slate-800">Meeting Ended</p>
                  <p className="text-sm text-slate-500 text-center">The meeting has been saved as completed.</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-rose-500" />
                      </div>
                      <div>
                        <h2 id="end-modal-title" className="text-lg font-bold text-slate-900 leading-tight">
                          End this meeting?
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      disabled={isPending}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-6">
                    <p className="text-sm text-rose-700 font-medium leading-relaxed">
                      Ending the meeting will mark the video call as <strong>completed</strong> in 
                      the system. Both participants will no longer be able to join this room.
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700 font-medium">
                      {error}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowModal(false)}
                      disabled={isPending}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      id="confirm-end-meeting-btn"
                      onClick={handleConfirm}
                      disabled={isPending}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-sm font-bold transition-all duration-200 shadow-sm shadow-rose-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Ending...</>
                      ) : (
                        <><PhoneOff className="w-4 h-4" /> Yes, End Meeting</>
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
