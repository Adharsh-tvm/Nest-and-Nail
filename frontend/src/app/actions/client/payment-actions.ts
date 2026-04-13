"use server";

import { createPaymentOrderApi, verifyPaymentApi } from "@/sources/api/payment.api";

export async function createPaymentOrderAction(
  serviceId: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await createPaymentOrderApi(serviceId);
    if (!res.success) {
      return { success: false, error: res.message };
    }
    return { success: true, data: res.payload };
  } catch (error: any) {
    console.error("createPaymentOrderAction error:", error);
    return { success: false, error: error.message || "Failed to create payment order" };
  }
}

export async function verifyPaymentAction(
  paymentData: any
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await verifyPaymentApi(paymentData);
    if (!res.success) {
      return { success: false, error: res.message };
    }
    return { success: true, data: res.payload };
  } catch (error: any) {
    console.error("verifyPaymentAction error:", error);
    return { success: false, error: error.message || "Failed to verify payment" };
  }
}
