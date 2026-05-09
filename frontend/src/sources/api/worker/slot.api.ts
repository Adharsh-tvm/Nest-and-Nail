import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { WORKER_ROUTES } from "@/sources/constant-api";
import axios from "axios";

interface IApiResponseData {
  success: boolean;
  message?: string;
  data?: unknown;
  payload?: unknown;
  error?: string | null;
}

export async function blockWorkerDatesApi(dates: string[], slotTypes: string[]): Promise<ApiResponse<unknown>> {
  try {
    const response = await axiosInstance.post(
      WORKER_ROUTES.BLOCK_DATES,
      { dates, slotTypes },
      { withCredentials: true }
    );

    const resData = response.data as IApiResponseData;
    if (resData.success) {
      return {
        success: true,
        message: resData.message || "Dates blocked successfully",
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

export async function getWorkerBlockedDatesApi(): Promise<ApiResponse<unknown>> {
  try {
    const response = await axiosInstance.get(
      WORKER_ROUTES.BLOCKED_DATES,
      { withCredentials: true }
    );

    const resData = response.data as IApiResponseData;
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
