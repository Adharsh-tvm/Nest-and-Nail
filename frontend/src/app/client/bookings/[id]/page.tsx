import React from "react";
import Link from "next/link";
import { CheckCircle2, MapPin, Calendar, Clock, Contact2, ChevronLeft } from "lucide-react";
import { getBookingDetailAction } from "@/app/actions/client/booking-actions";
import { SlotType } from "@/shared/types/serviceTypes";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const paramsObj = await params;
  const { success, data: booking } = await getBookingDetailAction(paramsObj.id);

  if (!success || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <Link
            href="/client/workers"
            className="text-emerald-600 font-semibold hover:text-emerald-700 underline"
          >
            Back to available workers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          href="/client/workers"
          className="inline-flex items-center text-gray-500 hover:text-emerald-600 transition-colors mb-6 font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to workers
        </Link>

        {/* Success Banner */}
        <div className="bg-emerald-600 rounded-t-[24px] p-8 text-center text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
          
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
             <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2 relative z-10">Booking Confirmed!</h1>
          <p className="text-emerald-100 font-medium relative z-10 text-lg">
            Booking ID: #{booking.id.slice(-6).toUpperCase()}
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-b-[24px] p-8 shadow-sm border border-gray-200 border-t-0 space-y-8">
          
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
             <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                <p className="font-bold text-emerald-600 flex items-center gap-1.5">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   {booking.status}
                </p>
             </div>
             <div className="text-right">
                <p className="text-sm font-medium text-gray-500 mb-1">Total Amount</p>
                <p className="font-bold text-gray-900 text-xl">₹{booking.amount}</p>
             </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
              Service Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Contact2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Professional</p>
                  <p className="font-bold text-gray-900">{booking.workerName}</p>
                  <p className="text-sm text-gray-500">{booking.category}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="font-bold text-gray-900">
                    {new Date(booking.scheduledDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Time Slot</p>
                  <p className="font-bold text-gray-900">
                    {booking.slotType === SlotType.MORNING_HALF ? "Morning (4-5 hrs)" :
                     booking.slotType === SlotType.EVENING_HALF ? "Evening (4-5 hrs)" : "Full Day (8-9 hrs)"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="font-bold text-gray-900">Default Client Address</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
