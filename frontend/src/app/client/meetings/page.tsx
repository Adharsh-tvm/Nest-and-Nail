import React from "react";
import { getClientScheduledMeetingsAction, getClientMeetingsHistoryAction } from "@/app/actions/client/meeting-actions";
import { getWorkerDetailAction } from "@/app/actions/client/view-worker-actions";
import ClientMeetingsView from "./ClientMeetingsView";

import { User } from "@/shared/types/userTypes";

export const metadata = {
  title: "My Meetings | Client",
};

export default async function ClientMeetingsPage() {
  const [scheduledRes, historyRes] = await Promise.all([
    getClientScheduledMeetingsAction(),
    getClientMeetingsHistoryAction()
  ]);

  const scheduledMeetings = scheduledRes.success && scheduledRes.data ? scheduledRes.data : [];
  const historyMeetings = historyRes.success && historyRes.data ? historyRes.data : [];

  const allMeetings = [...scheduledMeetings, ...historyMeetings];

  // Extract unique worker IDs
  const uniqueWorkerIds = Array.from(
    new Set(allMeetings.map((s) => s.workerId)),
  );

  // Fetch all worker details
  const workerDetailsPromises = uniqueWorkerIds.map((id) =>
    getWorkerDetailAction(id),
  );
  const workerResponses = await Promise.all(workerDetailsPromises);

  // Map worker ID to worker data
  const workerMap: Record<string, Partial<User>> = {};
  workerResponses.forEach((res) => {
    if (res.success && res.data) {
      workerMap[res.data.id || res.data.userId || ""] = res.data;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            My Meetings
          </h1>
          <p className="text-gray-500">Manage your scheduled and past video consultations</p>
        </div>

        <ClientMeetingsView
          scheduled={scheduledMeetings}
          history={historyMeetings}
          workerMap={workerMap}
        />
      </div>
    </div>
  );
}