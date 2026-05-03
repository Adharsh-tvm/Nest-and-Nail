import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { BookingPayload, BookingResult, SlotAvailability } from "@/shared/types/serviceTypes";
import { CLIENT_ROUTES } from "@/sources/constant-api";
import axios from "axios";

/**
 * Fetch availability for a worker on a specific date.
 * GET /api/client/workers/:id/availability?date=YYYY-MM-DD
 */
export async function getWorkerAvailabilityApi(
  workerId: string,
  date: string // YYYY-MM-DD
): Promise<ApiResponse<SlotAvailability>> {
  try {
    const response = await axiosInstance.get<ApiResponse<SlotAvailability>>(
      CLIENT_ROUTES.WORKER_AVAILABILITY(workerId),
      {
        params: { date },
        withCredentials: true,
      }
    );

    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message || "Failed to fetch availability",
        error: null,
      };
    }

    return {
      success: true,
      message: "Availability fetched",
      payload: response.data.payload,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch availability",
        error: error.response?.data?.error || null,
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
      error: null,
    };
  }
}

/**
 * Fetch availability for a worker over a date range.
 * GET /api/client/workers/:id/availability?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
export async function getWorkerAvailabilityBulkApi(
  workerId: string,
  startDate: string,
  endDate: string
): Promise<ApiResponse<Record<string, SlotAvailability>>> {
  try {
    const response = await axiosInstance.get<ApiResponse<Record<string, SlotAvailability>>>(
      CLIENT_ROUTES.WORKER_AVAILABILITY(workerId),
      {
        params: { startDate, endDate },
        withCredentials: true,
      }
    );

    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message || "Failed to fetch bulk availability",
        error: null,
      };
    }

    return {
      success: true,
      message: "Bulk availability fetched",
      payload: response.data.payload,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch bulk availability",
        error: error.response?.data?.error || null,
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
      error: null,
    };
  }
}

/**
 * Book a worker for a specific date and slot.
 * POST /api/client/services/book
 */
export async function bookWorkerApi(
  payload: BookingPayload
): Promise<ApiResponse<BookingResult>> {
  try {
    const response = await axiosInstance.post<ApiResponse<BookingResult>>(
      CLIENT_ROUTES.BOOK_SERVICE,
      payload,
      { withCredentials: true }
    );

    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message || "Booking failed",
        error: null,
      };
    }

    return {
      success: true,
      message: "Booking confirmed",
      payload: response.data.payload,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Booking failed. Please try again.",
        error: error.response?.data?.error || null,
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
      error: null,
    };
  }
}
