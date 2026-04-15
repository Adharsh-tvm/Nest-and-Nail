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
  ServiceResponseDTO
} from "@/shared/types/serviceTypes";
import {
  getClientOngoingServicesApi, getClientServiceHistoryApi, getClientServiceByIdApi, cancelServiceApi
} from "@/sources/api/client/service.api";

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

export async function getClientOngoingServicesAction(): Promise<{ success: boolean; data?: ServiceResponseDTO[]; error?: string }> {
    try {
        const response = await getClientOngoingServicesApi();
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: any) {
        console.error("Failed to fetch ongoing services", error);
        return { success: false, error: error.message || "Failed to fetch ongoing services" };
    }
}

export async function getClientServiceHistoryAction(): Promise<{ success: boolean; data?: ServiceResponseDTO[]; error?: string }> {
    try {
        const response = await getClientServiceHistoryApi();
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: any) {
        console.error("Failed to fetch service history", error);
        return { success: false, error: error.message || "Failed to fetch service history" };
    }
}

export async function getClientServiceByIdAction(serviceId: string): Promise<{ success: boolean; data?: ServiceResponseDTO; error?: string }> {
    try {
        const response = await getClientServiceByIdApi(serviceId);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: any) {
        console.error(`Failed to fetch service details for ${serviceId}`, error);
        return { success: false, error: error.message || "Failed to fetch service details" };
    }
}

export async function cancelServiceAction(
    serviceId: string,
    reason: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await cancelServiceApi(serviceId, reason);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true };
    } catch (error: any) {
        console.error(`Failed to cancel service ${serviceId}`, error);
        return { success: false, error: error.message || "Failed to cancel service" };
    }
}
