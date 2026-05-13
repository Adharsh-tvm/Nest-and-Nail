"use client";

import { useState, useTransition } from "react";
import { Star, X, CheckCircle2, Loader2, Send, MessageSquareHeart } from "lucide-react";
import toast from "react-hot-toast";
import { addReviewAction } from "@/app/actions/client/review-actions";

interface AddReviewButtonProps {
  serviceId: string;
}

export default function AddReviewButton({ serviceId }: AddReviewButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_CHARS = 500;

  const resetAndClose = () => {
    if (isPending) return;
    setShowModal(false);
    setRating(0);
    setHoverRating(0);
    setReview("");
    setError(null);
    setDone(false);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please provide a rating.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await addReviewAction(serviceId, rating, review.trim());
      if (res.success) {
        setDone(true);
        toast.success("Review submitted successfully!");
      } else {
        setError(res.error || "Failed to submit review. Please try again.");
      }
    });
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-sm transition-all active:scale-95 mt-4"
      >
        <Star className="w-4 h-4" />
        Rate and Review
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
            <div className="h-1.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500" />

            <div className="p-8">
              {done ? (
                /* ── Success ── */
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">Review Submitted!</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Thank you for your feedback.
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
                      <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                        <MessageSquareHeart className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 leading-tight">
                          Rate Service
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          How was your experience?
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

                  {/* Rating Stars */}
                  <div className="mb-6 flex flex-col items-center">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= (hoverRating || rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200"
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-2">
                      {rating > 0 ? `You rated ${rating} star${rating > 1 ? "s" : ""}` : "Select a rating"}
                    </p>
                  </div>

                  {/* Textarea */}
                  <div className="mb-5">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Leave a review (optional)
                    </label>
                    <textarea
                      rows={4}
                      value={review}
                      onChange={(e) => {
                        if (e.target.value.length <= MAX_CHARS) setReview(e.target.value);
                      }}
                      placeholder="Share details of your experience..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 resize-none transition-all"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-slate-400 font-medium"></span>
                      <span
                        className={`text-[10px] font-medium ${
                          review.length > MAX_CHARS * 0.9
                            ? "text-red-400"
                            : "text-slate-400"
                        }`}
                      >
                        {review.length}/{MAX_CHARS}
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
                      disabled={isPending || rating === 0}
                      className="flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-indigo-200/50 flex items-center justify-center gap-2"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Review
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
