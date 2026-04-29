"use server";

import { raiseConcernApi, ConcernDTO } from "@/sources/api/concern.api";

export async function raiseConcernAction(
  serviceId: string,
  message: string
): Promise<{ success: boolean; data?: ConcernDTO; error?: string }> {
  try {
    const res = await raiseConcernApi(serviceId, message);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to raise concern" };
    }
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error("raiseConcernAction error:", error);
    return { success: false, error: error.message || "Failed to raise concern" };
  }
}
