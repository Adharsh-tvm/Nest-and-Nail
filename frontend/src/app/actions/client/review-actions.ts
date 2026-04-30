"use server";

import { addReviewApi } from "@/sources/api/review.api";

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
  } catch (error: any) {
    console.error("addReviewAction error:", error);
    return { success: false, error: error.message || "Failed to submit review" };
  }
}
