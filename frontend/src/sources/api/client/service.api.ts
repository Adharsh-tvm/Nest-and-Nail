import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { ServiceResponseDTO } from "@/shared/types/serviceTypes";
import axios from 'axios';

interface BackendResponse<T> {
  success: boolean;
  payload?: T;
  message?: string;
  error?: string;
}

export async function getClientOngoingServicesApi(): Promise<ApiResponse<ServiceResponseDTO[]>> {
    try {
        const response = await axiosInstance.get<BackendResponse<ServiceResponseDTO[]>>('/api/client/services/ongoing', { withCredentials: true });
        
        if (!response.data.success) {
            return {
                error: response.data.error || null,
                success: false,
                message: response.data.message || "Failed to fetch ongoing services",
            };
        }
        
        return {
            payload: response.data.payload as ServiceResponseDTO[],
            success: true,
            message: response.data.message || "Ongoing services fetched successfully",
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return {
                error: error.response?.data?.error || null,
                success: false,
                message: error.response?.data?.message || 'Failed to fetch ongoing services',
            };
        }
        return {
            error: null,
            success: false,
            message: 'An unexpected error occurred',
        };
    }
}

export async function getClientServiceHistoryApi(): Promise<ApiResponse<ServiceResponseDTO[]>> {
    try {
        const response = await axiosInstance.get<BackendResponse<ServiceResponseDTO[]>>('/api/client/services/history', { withCredentials: true });
        
        if (!response.data.success) {
            return {
                error: response.data.error || null,
                success: false,
                message: response.data.message || "Failed to fetch service history",
            };
        }
        
        return {
            payload: response.data.payload as ServiceResponseDTO[],
            success: true,
            message: response.data.message || "Service history fetched successfully",
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return {
                error: error.response?.data?.error || null,
                success: false,
                message: error.response?.data?.message || 'Failed to fetch service history',
            };
        }
        return {
            error: null,
            success: false,
            message: 'An unexpected error occurred',
        };
    }
}

export async function getClientServiceByIdApi(serviceId: string): Promise<ApiResponse<ServiceResponseDTO>> {
    try {
        const response = await axiosInstance.get<BackendResponse<ServiceResponseDTO>>(`/api/client/services/${serviceId}`, { withCredentials: true });
        
        if (!response.data.success) {
            return {
                error: response.data.error || null,
                success: false,
                message: response.data.message || "Failed to fetch service details",
            };
        }
        
        return {
            payload: response.data.payload as ServiceResponseDTO,
            success: true,
            message: response.data.message || "Service details fetched successfully",
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return {
                error: error.response?.data?.error || null,
                success: false,
                message: error.response?.data?.message || 'Failed to fetch service details',
            };
        }
        return {
            error: null,
            success: false,
            message: 'An unexpected error occurred',
        };
    }
}

export async function cancelServiceApi(serviceId: string, reason: string): Promise<ApiResponse<null>> {
    try {
        const response = await axiosInstance.patch<BackendResponse<null>>(
            `/api/client/services/${serviceId}/cancel`,
            { reason },
            { withCredentials: true }
        );

        if (!response.data.success) {
            return {
                error: response.data.error || null,
                success: false,
                message: response.data.message || "Failed to cancel service",
            };
        }

        return {
            payload: null,
            success: true,
            message: response.data.message || "Service cancelled successfully",
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return {
                error: error.response?.data?.error || null,
                success: false,
                message: error.response?.data?.message || 'Failed to cancel service',
            };
        }
        return {
            error: null,
            success: false,
            message: 'An unexpected error occurred',
        };
    }
}
