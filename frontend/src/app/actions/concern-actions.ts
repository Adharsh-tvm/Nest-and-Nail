"use server";

import { raiseConcernApi, ConcernDTO } from "@/sources/api/user/concern.api";

export async function raiseConcernAction(
  formData: FormData
): Promise<{ success: boolean; data?: ConcernDTO; error?: string }> {
  try {
    const serviceId = formData.get("serviceId") as string;
    const message = formData.get("message") as string;
    const files = formData.getAll("images") as File[];

    const res = await raiseConcernApi(serviceId, message, files);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to raise concern" };
    }
    return { success: true, data: res.data };
  } catch (error: unknown) {
    console.error("raiseConcernAction error:", error);
    return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to raise concern" };
  }
}
