import React from "react";
import { getClientServiceHistoryAction } from "@/app/actions/client/service-actions";
import { getWorkerDetailAction } from "@/app/actions/client/view-worker-actions";
import ClientServicesView from "./ClientServicesView";

import { User } from "@/shared/types/userTypes";

export const metadata = {
  title: "My Services | Client",
};

export default async function ClientServicesPage() {
  const res = await getClientServiceHistoryAction();
  const allServicesRaw = res.success && res.data ? res.data : [];

  // Sort by date descending
  const sortedServices = [...allServicesRaw].sort(
    (a, b) =>
      new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime(),
  );

  const ongoingServices = sortedServices.filter((s) =>
    ["OPEN", "PENDING", "CONFIRMED", "IN_PROGRESS"].includes(s.status),
  );

  const cancelledServices = sortedServices.filter((s) =>
    ["CANCELLED", "CANCELLED_BY_CLIENT", "CANCELLED_BY_WORKER"].includes(s.status),
  );

  const historyServices = sortedServices.filter(
    (s) =>
      ![
        "OPEN", "PENDING", "CONFIRMED", "IN_PROGRESS",
        "CANCELLED", "CANCELLED_BY_CLIENT", "CANCELLED_BY_WORKER",
      ].includes(s.status),
  );

  const allServices = sortedServices;

  // Extract unique worker IDs
  const uniqueWorkerIds = Array.from(
    new Set(allServices.map((s) => s.workerId)),
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
            My Services
          </h1>
        </div>

        <ClientServicesView
          ongoing={ongoingServices}
          history={historyServices}
          cancelled={cancelledServices}
          workerMap={workerMap}
        />
      </div>
    </div>
  );
}
