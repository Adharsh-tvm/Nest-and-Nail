"use server";

import {
  getWorkerAvailabilityApi,
  getWorkerAvailabilityBulkApi,
  bookWorkerApi,
  lockWorkerSlotsApi,
  unlockWorkerSlotsApi,
} from "@/sources/api/service/service.api";
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
  } catch (error: unknown) {
    console.error("getWorkerAvailabilityAction error:", error);
    return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to fetch availability" };
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
  } catch (error: unknown) {
    console.error("getWorkerAvailabilityBulkAction error:", error);
    return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to bulk fetch availability" };
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
  } catch (error: unknown) {
    console.error("bookWorkerAction error:", error);
    return { success: false, error: (error instanceof Error ? error.message : undefined) || "Booking failed" };
  }
}

export async function getClientOngoingServicesAction(): Promise<{ success: boolean; data?: ServiceResponseDTO[]; error?: string }> {
    try {
        const response = await getClientOngoingServicesApi();
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: unknown) {
        console.error("Failed to fetch ongoing services", error);
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to fetch ongoing services" };
    }
}

export async function getClientServiceHistoryAction(): Promise<{ success: boolean; data?: ServiceResponseDTO[]; error?: string }> {
    try {
        const response = await getClientServiceHistoryApi();
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: unknown) {
        console.error("Failed to fetch service history", error);
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to fetch service history" };
    }
}

export async function getClientServiceByIdAction(serviceId: string): Promise<{ success: boolean; data?: ServiceResponseDTO; error?: string }> {
    try {
        const response = await getClientServiceByIdApi(serviceId);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: unknown) {
        console.error(`Failed to fetch service details for ${serviceId}`, error);
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to fetch service details" };
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
    } catch (error: unknown) {
        console.error(`Failed to cancel service ${serviceId}`, error);
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to cancel service" };
    }
}

export async function lockWorkerSlotsAction(data: {
  workerId: string;
  selectedSlots: { date: string; slotType: string }[];
  serviceId: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await lockWorkerSlotsApi(data);
    if (!res.success) {
      return { success: false, error: res.message };
    }
    return { success: true };
  } catch (error: unknown) {
    console.error("lockWorkerSlotsAction error:", error);
    return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to lock slots" };
  }
}

export async function unlockWorkerSlotsAction(data: {
  workerId: string;
  selectedSlots: { date: string; slotType: string }[];
  serviceId: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await unlockWorkerSlotsApi(data);
    if (!res.success) {
      return { success: false, error: res.message };
    }
    return { success: true };
  } catch (error: unknown) {
    console.error("unlockWorkerSlotsAction error:", error);
    return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to unlock slots" };
  }
}
