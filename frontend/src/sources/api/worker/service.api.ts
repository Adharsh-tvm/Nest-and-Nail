import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { ServiceResponseDTO } from "@/shared/types/serviceTypes";
import { WORKER_ROUTES } from "@/sources/constant-api";
import axios from "axios";

/**
 * Fetch the currently active service for the worker
 * GET /api/worker/service/services/active
 */
export async function getActiveWorkerServiceApi(): Promise<ApiResponse<ServiceResponseDTO | null>> {
  try {
    const response = await axiosInstance.get<ApiResponse<ServiceResponseDTO | null>>(
      WORKER_ROUTES.ACTIVE_SERVICE,
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
      WORKER_ROUTES.SERVICES,
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

/**
 * Start a specific service by worker (must be CONFIRMED status)
 * PATCH /api/worker/services/:serviceId/start
 */
export async function startWorkerServiceApi(
  serviceId: string,
  lat: number,
  lng: number
): Promise<ApiResponse<ServiceResponseDTO>> {
  try {
    const response = await axiosInstance.patch(
      WORKER_ROUTES.START_SERVICE(serviceId),
      { lat, lng },
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
        message: resData.message || "Failed to start service",
        error: resData.error || null,
      };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to start service",
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
 * Fetch details of a specific service
 * GET /api/worker/services/:serviceId
 */
export async function getWorkerServiceDetailsApi(serviceId: string): Promise<ApiResponse<ServiceResponseDTO>> {
  try {
    const response = await axiosInstance.get(WORKER_ROUTES.SERVICE_DETAILS(serviceId), {
      withCredentials: true,
    });

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
        message: resData.message || "Failed to fetch service details",
        error: resData.error || null,
      };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch service details",
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
 * Mark a service as completed by the worker
 * PATCH /api/worker/services/:serviceId/complete
 */
export async function completeWorkerServiceApi(serviceId: string): Promise<ApiResponse<ServiceResponseDTO>> {
  try {
    const response = await axiosInstance.patch(
      WORKER_ROUTES.COMPLETE_SERVICE(serviceId),
      {},
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
        message: resData.message || "Failed to complete service",
        error: resData.error || null,
      };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to complete service",
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
