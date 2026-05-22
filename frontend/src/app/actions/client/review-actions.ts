"use server";

import { addReviewApi } from "@/sources/api/client/review.api";

export async function addReviewAction(
  serviceId: string,
  rating: number,
  review?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await addReviewApi(serviceId, rating, review);
    if (!res.success) {
      return { success: false, error: res.message };
    }
    return { success: true };
  } catch (error: unknown) {
    console.error("addReviewAction error:", error);
    return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to submit review" };
  }
}
