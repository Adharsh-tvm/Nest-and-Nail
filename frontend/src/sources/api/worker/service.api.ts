import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { ServiceResponseDTO } from "@/shared/types/serviceTypes";
import axios from "axios";

/**
 * Fetch the currently active service for the worker
 * GET /api/worker/service/services/active
 */
export async function getActiveWorkerServiceApi(): Promise<ApiResponse<ServiceResponseDTO | null>> {
  try {
    const response = await axiosInstance.get<ApiResponse<ServiceResponseDTO | null>>(
      "/api/worker/services/active",
      { withCredentials: true }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch active service",
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
 * Fetch all services for the worker
 * GET /api/worker/services
 */
export async function getWorkerServicesApi(status?: string): Promise<ApiResponse<ServiceResponseDTO[]>> {
  try {
    const response = await axiosInstance.get<ApiResponse<ServiceResponseDTO[]>>(
      "/api/worker/services",
      {
        params: status ? { status } : {},
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch worker services",
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
