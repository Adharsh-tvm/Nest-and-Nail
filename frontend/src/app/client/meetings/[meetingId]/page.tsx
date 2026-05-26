import React from "react";
import { notFound } from "next/navigation";
import { getClientMeetingByIdAction, endMeetingAction } from "@/app/actions/client/meeting-actions";
import { PaymentStatus, SLOT_LABELS, ServiceResponseDTO } from "@/shared/types/serviceTypes";
import Link from "next/link";
import { 
  CalendarDays, Clock, Video, CreditCard, ArrowLeft,
  CheckCircle2, AlertCircle, Timer, XCircle, Star
} from "lucide-react";
import EndMeetingButton from "@/app/components/containers/meetings/EndMeetingButton";
import CancelMeetingButton from "@/app/components/containers/meetings/CancelMeetingButton";
import { cancelServiceAction } from "@/app/actions/client/service-actions";
import ChatDrawer from "@/app/components/containers/chat/ChatDrawer";
import MeetingRingAlert from "@/app/components/containers/meetings/MeetingRingAlert";
import AddReviewButton from "@/app/components/containers/services/AddReviewButton";

export async function generateMetadata() {
  return { title: `Meeting Details | Client` };
}

export default async function ClientMeetingDetailPage({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  const res = await getClientMeetingByIdAction(meetingId);

  if (!res.success || !res.data) {
    notFound();
  }

  const meeting = res.data;
  const worker = (meeting as ServiceResponseDTO & { worker?: { name: string; email?: string } }).worker;
  const client = (meeting as ServiceResponseDTO & { client?: { name: string; email?: string } }).client;

  const formatDate = (d: string | Date) =>
    new Date(d).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });

  const formatTime = (d: string | Date) =>
    new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    CONFIRMED: { label: "Confirmed", color: "text-violet-700", bg: "bg-violet-50 border-violet-200", icon: <CheckCircle2 className="w-4 h-4" /> },
    PENDING:   { label: "Pending",   color: "text-amber-700",  bg: "bg-amber-50 border-amber-200",  icon: <Timer className="w-4 h-4" /> },
    IN_PROGRESS: { label: "In Progress", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: <AlertCircle className="w-4 h-4" /> },
    COMPLETED: { label: "Completed", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: <CheckCircle2 className="w-4 h-4" /> },
    CANCELLED: { label: "Cancelled", color: "text-rose-700",   bg: "bg-rose-50 border-rose-200",   icon: <XCircle className="w-4 h-4" /> },
    CANCELLED_BY_CLIENT: { label: "Cancelled by You", color: "text-rose-700", bg: "bg-rose-50 border-rose-200", icon: <XCircle className="w-4 h-4" /> },
    CANCELLED_BY_WORKER: { label: "Cancelled by Worker", color: "text-rose-700", bg: "bg-rose-50 border-rose-200", icon: <XCircle className="w-4 h-4" /> },
  };



  const statusInfo = statusConfig[meeting.status] ?? { label: meeting.status, color: "text-slate-700", bg: "bg-slate-50 border-slate-200", icon: null };

  const slot = meeting.selectedSlots[0];
  const slotLabel = slot ? (SLOT_LABELS[slot.slotType] ?? slot.slotType) : "—";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Back */}
        <Link
          href="/client/meetings"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Meetings
        </Link>

        {/* Hero card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/60 overflow-hidden mb-6">
          {/* Gradient bar */}
          <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-violet-400" />

          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-100">
                  <Video className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 leading-tight">Video Consultation</h1>
                  <p className="text-sm font-mono text-slate-400 mt-0.5">
                    #{meeting.serviceId.substring(0, 12).toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-bold ${statusInfo.bg} ${statusInfo.color}`}>
                  {statusInfo.icon}
                  {statusInfo.label}
                </div>
              </div>
            </div>

            {/* Participants Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Client Info (You) */}
              {client && (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-2">Client (You)</p>
                  <div>
                    <p className="font-bold text-slate-800 text-lg">{client.name}</p>
                    {client.email && <p className="text-sm text-slate-500">{client.email}</p>}
                  </div>
                </div>
              )}

              {/* Worker Info */}
              {worker && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Worker</p>
                  <div>
                    <p className="font-bold text-slate-800 text-lg">{worker.name}</p>
                    {worker.email && <p className="text-sm text-slate-500">{worker.email}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Scheduled Date</span>
                </div>
                <p className="font-bold text-slate-800 text-sm">{formatDate(meeting.scheduledDate)}</p>
              </div>

              <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">Time Slot</span>
                </div>
                <p className="font-bold text-slate-800 text-sm">{slotLabel}</p>
              </div>

              {meeting.videoCall?.startTime && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Booked Start Time</span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{formatTime(meeting.videoCall.startTime)}</p>
                </div>
              )}

              {meeting.videoCall?.endTime && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Booked End Time</span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{formatTime(meeting.videoCall.endTime)}</p>
                </div>
              )}
              
              {meeting.videoCall?.duration && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Timer className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Duration</span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{meeting.videoCall.duration}</p>
                </div>
              )}

              {/* Actual Meeting Times — shown only for completed meetings */}
              {meeting.status === "COMPLETED" && meeting.videoCall?.actualStartTime && (
                <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-violet-500" />
                    <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">Actual Start Time</span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">
                    {new Date(meeting.videoCall.actualStartTime).toLocaleString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              )}

              {meeting.status === "COMPLETED" && meeting.videoCall?.endedAt && (
                <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-violet-500" />
                    <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">Actual End Time</span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">
                    {new Date(meeting.videoCall.endedAt).toLocaleString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              )}

              {/* Cost Breakdown */}
              {meeting.totalAmount !== undefined && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 sm:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Payment Summary</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Base Meeting Fee</span>
                      <span className="font-medium">₹{meeting.pricePerWorker || 0}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Platform Fee</span>
                      <span className="font-medium">₹10</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-bold pt-2 border-t border-slate-200 mt-2">
                      <span>Total Paid</span>
                      <span className="text-emerald-600">₹{meeting.totalAmount}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
                    <span>Payment Status:</span>
                    <span className={`font-bold uppercase tracking-wider ${meeting.paymentStatus === PaymentStatus.SUCCESS ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {meeting.paymentStatus}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Join CTA for confirmed meetings */}
            {meeting.status === "CONFIRMED" && (
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 border border-emerald-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-white">
                  <Video className="w-5 h-5" />
                  <div>
                    <p className="font-bold text-sm">Your meeting is confirmed!</p>
                    <p className="text-emerald-100 text-xs">Join at the scheduled time</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/client/video-call/${meeting.serviceId}`}
                    className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm"
                  >
                    <Video className="w-4 h-4" />
                    Join Now
                  </Link>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <EndMeetingButton
                        serviceId={meeting.serviceId}
                        videoCallStatus={meeting.videoCall?.status}
                        endMeetingAction={endMeetingAction}
                    />
                    <CancelMeetingButton
                        serviceId={meeting.serviceId}
                        category={meeting.category}
                        scheduledDate={meeting.scheduledDate}
                        createdAt={meeting.createdAt}
                        cancelServiceAction={cancelServiceAction}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* If Pending, allow cancellation */}
            {meeting.status === "PENDING" && (
                <div className="mt-6 flex justify-end">
                    <CancelMeetingButton
                        serviceId={meeting.serviceId}
                        category={meeting.category}
                        scheduledDate={meeting.scheduledDate}
                        createdAt={meeting.createdAt}
                        cancelServiceAction={cancelServiceAction}
                    />
                </div>
            )}

            {/* If Completed, show Review section */}
            {meeting.status === "COMPLETED" && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                {meeting.review ? (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      Your Rating & Review
                    </h3>
                    
                    <div className="bg-gradient-to-br from-indigo-50/40 via-purple-50/20 to-white rounded-2xl p-6 border border-indigo-50/60 shadow-inner relative overflow-hidden">
                      {/* Decorative quote mark */}
                      <div className="absolute right-4 bottom-2 text-indigo-100/40 pointer-events-none select-none font-serif text-8xl">
                        ”
                      </div>
                      
                      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= (meeting.review?.rating ?? 0)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-slate-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg">
                            {meeting.review.rating.toFixed(1)} / 5.0
                          </span>
                        </div>
                        {meeting.review.createdAt && (
                          <span className="text-xs text-slate-400 font-medium">
                            Reviewed on {new Date(meeting.review.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-slate-700 text-sm leading-relaxed italic relative z-10">
                        &ldquo;{meeting.review.review || "No review description left."}&rdquo;
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
                    <p className="text-sm font-medium text-slate-600 mb-2">How was your video consultation?</p>
                    <p className="text-xs text-slate-400 mb-4">Share your feedback to help improve the service.</p>
                    <AddReviewButton serviceId={meeting.serviceId} />
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Booking Meta */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Booking Info</p>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Meeting ID</span>
              <span className="font-mono font-medium text-slate-700">{meeting.serviceId.substring(0, 12).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Category</span>
              <span className="font-medium text-slate-700">{meeting.category.replace(/_/g, " ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Booked on</span>
              <span className="font-medium text-slate-700">
                {new Date(meeting.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

      </div>
      {!["COMPLETED", "CANCELLED", "CANCELLED_BY_CLIENT", "CANCELLED_BY_WORKER"].includes(meeting.status) && (
        <ChatDrawer
          chatId={meeting.serviceId}
          receiverId={meeting.workerId}
          receiverName={worker?.name}
        />
      )}
      {meeting.status === "CONFIRMED" && (
        <MeetingRingAlert
          serviceId={meeting.serviceId}
          role="CLIENT"
          callerName={worker?.name || "Worker"}
        />
      )}
    </div>
  );
}
