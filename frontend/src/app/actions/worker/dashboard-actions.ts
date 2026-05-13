"use server";

import { fetchWorkerDashboardData } from "@/sources/api/worker/dashboard.api";
import axios from "axios";

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
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data?.message : (error instanceof Error ? error.message : undefined);
    return {
      success: false,
      message: message || "Failed to fetch dashboard data",
    };
  }
}
