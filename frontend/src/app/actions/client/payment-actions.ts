"use server";

import { createPaymentOrderApi, verifyPaymentApi, processWalletPaymentApi, IVerifyPaymentData } from "@/sources/api/user/payment.api";

export async function createPaymentOrderAction(
  serviceId: string
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const res = await createPaymentOrderApi(serviceId);
    if (!res.success) {
      return { success: false, error: res.message };
    }
    const payloadObj = res.payload as Record<string, unknown> | null | undefined;
    return { success: true, data: payloadObj?.payload ?? res.payload };
  } catch (error: unknown) {
    console.error("createPaymentOrderAction error:", error);
    return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to create payment order" };
  }
}

export async function verifyPaymentAction(
  paymentData: IVerifyPaymentData
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const res = await verifyPaymentApi(paymentData);
    if (!res.success) {
      return { success: false, error: res.message };
    }
    const payloadObj = res.payload as Record<string, unknown> | null | undefined;
    return { success: true, data: payloadObj?.payload ?? res.payload };
  } catch (error: unknown) {
    console.error("verifyPaymentAction error:", error);
    return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to verify payment" };
  }
}

export async function processWalletPaymentAction(
  serviceId: string
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const res = await processWalletPaymentApi(serviceId);
    if (!res.success) {
      return { success: false, error: res.message };
    }
    const payloadObj = res.payload as Record<string, unknown> | null | undefined;
    return { success: true, data: payloadObj?.payload ?? res.payload };
  } catch (error: unknown) {
    console.error("processWalletPaymentAction error:", error);
    return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to process wallet payment" };
  }
}
