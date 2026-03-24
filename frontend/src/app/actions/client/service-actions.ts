"use server";

import {
  getWorkerAvailabilityApi,
  getWorkerAvailabilityBulkApi,
  bookWorkerApi,
} from "@/sources/api/service.api";
import {
  BookingPayload,
  BookingResult,
  SlotAvailability,
} from "@/shared/types/serviceTypes";

export async function getWorkerAvailabilityAction(
  workerId: string,
  date: string // YYYY-MM-DD
): Promise<{ success: boolean; data?: SlotAvailability; error?: string }> {
  try {
    const res = await getWorkerAvailabilityApi(workerId, date);
    if (!res.success) {
      return { success: false, error: res.message };
    }
    return { success: true, data: res.payload };
  } catch (error: any) {
    console.error("getWorkerAvailabilityAction error:", error);
    return { success: false, error: error.message || "Failed to fetch availability" };
  }
}

export async function getWorkerAvailabilityBulkAction(
  workerId: string,
  startDate: string,
  endDate: string
): Promise<{ success: boolean; data?: Record<string, SlotAvailability>; error?: string }> {
  try {
    const res = await getWorkerAvailabilityBulkApi(workerId, startDate, endDate);
    if (!res.success) {
      return { success: false, error: res.message };
    }
    return { success: true, data: res.payload };
  } catch (error: any) {
    console.error("getWorkerAvailabilityBulkAction error:", error);
    return { success: false, error: error.message || "Failed to bulk fetch availability" };
  }
}

export async function bookWorkerAction(
  payload: BookingPayload
): Promise<{ success: boolean; data?: BookingResult; error?: string }> {
  try {
    const res = await bookWorkerApi(payload);
    if (!res.success) {
      return { success: false, error: res.message };
    }
    return { success: true, data: res.payload };
  } catch (error: any) {
    console.error("bookWorkerAction error:", error);
    return { success: false, error: error.message || "Booking failed" };
  }
}
