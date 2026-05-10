import React from "react";
import { getWorkerDetailAction } from "@/app/actions/client/view-worker-actions";
import { ChevronLeft, XCircle } from "lucide-react";
import Link from "next/link";
import { MeetingBookingSection } from "./MeetingBookingSection";

export default async function ScheduleMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const paramsObj = await params;
  const { success, data: worker, error } = await getWorkerDetailAction(
    paramsObj.id
  );

  if (error || !success || !worker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Worker Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            {error ||
              "The worker profile you're looking for doesn't exist or is unavailable."}
          </p>
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
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Link */}
        <Link
          href={`/client/workers/${paramsObj.id}`}
          className="inline-flex items-center text-gray-500 hover:text-emerald-600 transition-colors mb-4 font-medium text-sm"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to {worker.name}&#39;s profile
        </Link>
        
        {/* Top Info Banner */}
        <div className="bg-white rounded-[16px] p-4 shadow-sm border border-gray-100 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-emerald-100">
               {(worker.profileImageUrl || worker.profilePictureUrl) ? (
                 // eslint-disable-next-line @next/next/no-img-element
                 <img 
                   src={worker.profileImageUrl || worker.profilePictureUrl || ""}
                   alt={worker.name}
                   className="object-cover w-full h-full"
                 />
               ) : (
                 <span className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                    {worker.name.substring(0, 2).toUpperCase()}
                 </span>
               )}
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Schedule Meeting with {worker.name}</h1>
              <p className="text-xs font-medium text-gray-500">
                15-Minute Video Consultation
              </p>
            </div>
          </div>
        </div>

        {/* The Meeting Flow */}
        <MeetingBookingSection worker={worker} />
      </div>
    </div>
  );
}
