"use client";

import { useState, useTransition } from "react";
import {
  MessageSquareWarning,
  X,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Send,
  UploadCloud,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { raiseConcernAction } from "@/app/actions/concern-actions";

interface RaiseConcernButtonProps {
  serviceId: string;
}

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export default function RaiseConcernButton({ serviceId }: RaiseConcernButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);

  const MAX_CHARS = 1000;

  const resetAndClose = () => {
    if (isPending) return;
    setShowModal(false);
    setMessage("");
    setError(null);
    setDone(false);
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    if (images.length + newFiles.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    const newItems: ImageItem[] = [];

    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB).`);
        continue;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} must be an image (JPEG, PNG, or WEBP).`);
        continue;
      }

      const tempId = Math.random().toString(36).substring(2, 9);
      const previewUrl = URL.createObjectURL(file);

      newItems.push({
        id: tempId,
        file,
        previewUrl,
      });
    }

    setImages((prev) => [...prev, ...newItems]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error("Please describe your concern.");
      return;
    }

    const formData = new FormData();
    formData.append("serviceId", serviceId);
    formData.append("message", message.trim());
    images.forEach((img) => {
      formData.append("images", img.file);
    });

    setError(null);
    startTransition(async () => {
      const res = await raiseConcernAction(formData);
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

                  {/* Photo Upload Section */}
                  <div className="mb-5">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Attachments <span className="text-slate-400 font-normal text-xs">(optional, max 5)</span>
                    </label>
                    
                    {/* Upload Zone */}
                    {images.length < 5 && (
                      <div className="relative">
                        <input
                          type="file"
                          multiple
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          disabled={isPending}
                        />
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-amber-400 focus-within:border-amber-400 rounded-2xl py-5 px-4 bg-slate-50/50 hover:bg-slate-50 transition-all text-center">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-2">
                            <UploadCloud className="w-5 h-5 text-amber-500 animate-pulse" />
                          </div>
                          <p className="text-xs font-bold text-slate-700">Click or drag images to upload</p>
                          <p className="text-[10px] text-slate-400 mt-1">JPEG, PNG, or WEBP up to 5MB each</p>
                        </div>
                      </div>
                    )}

                    {/* Previews Grid */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        {images.map((img) => (
                          <div
                            key={img.id}
                            className="relative group aspect-square rounded-2xl border border-slate-100 overflow-hidden bg-slate-50"
                          >
                            <img
                              src={img.previewUrl}
                              alt="Concern attachment"
                              className="w-full h-full object-cover"
                            />

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => removeImage(img.id)}
                              disabled={isPending}
                              className="absolute top-1.5 right-1.5 p-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-500 hover:text-red-500 shadow-sm border border-slate-100 transition-all active:scale-90"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
