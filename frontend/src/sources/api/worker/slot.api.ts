import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import axios from "axios";

export async function blockWorkerDatesApi(dates: string[], slotTypes: string[]): Promise<ApiResponse<any>> {
  try {
    const response = await axiosInstance.post(
      "/api/worker/slot/block-dates",
      { dates, slotTypes },
      { withCredentials: true }
    );

    const resData = response.data as any;
    if (resData.success) {
      return {
        success: true,
        message: resData.message,
        payload: resData.data || resData.payload || null,
      };
    } else {
      return {
        success: false,
        message: resData.message || "Failed to block dates",
        error: resData.error || null,
      };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to block dates",
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

export async function getWorkerBlockedDatesApi(): Promise<ApiResponse<any>> {
  try {
    const response = await axiosInstance.get(
      "/api/worker/slot/blocked-dates",
      { withCredentials: true }
    );

    const resData = response.data as any;
    if (resData.success) {
      return {
        success: true,
        message: resData.message || "Fetched successfully",
        payload: resData.data || resData.payload || null,
      };
    } else {
      return {
        success: false,
        message: resData.message || "Failed to fetch blocked dates",
        error: resData.error || null,
      };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch blocked dates",
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
