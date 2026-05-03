"use server";

import { createPaymentOrderApi, verifyPaymentApi, processWalletPaymentApi } from "@/sources/api/user/payment.api";

export async function createPaymentOrderAction(
  serviceId: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await createPaymentOrderApi(serviceId);
    if (!res.success) {
      return { success: false, error: res.message };
    }
    // res.payload is the raw HTTP response body: { success, message, payload: actualData }
    return { success: true, data: (res.payload as any)?.payload ?? res.payload };
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
    return { success: true, data: (res.payload as any)?.payload ?? res.payload };
  } catch (error: any) {
    console.error("verifyPaymentAction error:", error);
    return { success: false, error: error.message || "Failed to verify payment" };
  }
}

export async function processWalletPaymentAction(
  serviceId: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await processWalletPaymentApi(serviceId);
    if (!res.success) {
      return { success: false, error: res.message };
    }
    return { success: true, data: (res.payload as any)?.payload ?? res.payload };
  } catch (error: any) {
    console.error("processWalletPaymentAction error:", error);
    return { success: false, error: error.message || "Failed to process wallet payment" };
  }
}
