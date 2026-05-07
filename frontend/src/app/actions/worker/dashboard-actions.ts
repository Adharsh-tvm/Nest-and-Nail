"use server";

import { fetchWorkerDashboardData } from "@/sources/api/worker/dashboard.api";

export async function getWorkerDashboardDataAction(months?: number) {
  try {
    const data = await fetchWorkerDashboardData(months);
    if (data.success) {
      return {
        success: true,
        payload: data.payload,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to fetch dashboard data",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch dashboard data",
    };
  }
}
