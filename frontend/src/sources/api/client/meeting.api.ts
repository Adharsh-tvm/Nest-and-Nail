import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { ServiceResponseDTO } from "@/shared/types/serviceTypes";
import { CLIENT_ROUTES, VIDEO_ROUTES } from "@/sources/constant-api";
import axios from 'axios';

interface BackendResponse<T> {
  success: boolean;
  payload?: T;
  message?: string;
  error?: string;
}

export async function getClientScheduledMeetingsApi(): Promise<ApiResponse<ServiceResponseDTO[]>> {
    try {
        const response = await axiosInstance.get<BackendResponse<ServiceResponseDTO[]>>(CLIENT_ROUTES.MEETINGS_SCHEDULED, { withCredentials: true });
        
        if (!response.data.success) {
            return { error: response.data.error || null, success: false, message: response.data.message || "Failed" };
        }
        
        return { payload: response.data.payload as ServiceResponseDTO[], success: true, message: response.data.message || "Success" };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data?.error || null, success: false, message: error.response?.data?.message || 'Failed' };
        }
        return { error: null, success: false, message: 'Unexpected error' };
    }
}

export async function getClientMeetingsHistoryApi(): Promise<ApiResponse<ServiceResponseDTO[]>> {
    try {
        const response = await axiosInstance.get<BackendResponse<ServiceResponseDTO[]>>(CLIENT_ROUTES.MEETINGS_HISTORY, { withCredentials: true });
        
        if (!response.data.success) {
            return { error: response.data.error || null, success: false, message: response.data.message || "Failed" };
        }
        
        return { payload: response.data.payload as ServiceResponseDTO[], success: true, message: response.data.message || "Success" };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data?.error || null, success: false, message: error.response?.data?.message || 'Failed' };
        }
        return { error: null, success: false, message: 'Unexpected error' };
    }
}

export async function getClientMeetingByIdApi(serviceId: string): Promise<ApiResponse<ServiceResponseDTO>> {
    try {
        const response = await axiosInstance.get<BackendResponse<ServiceResponseDTO>>(CLIENT_ROUTES.MEETING_BY_ID(serviceId), { withCredentials: true });
        if (!response.data.success) {
            return { error: response.data.error || null, success: false, message: response.data.message || "Failed" };
        }
        return { payload: response.data.payload as ServiceResponseDTO, success: true, message: response.data.message || "Success" };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data?.error || null, success: false, message: error.response?.data?.message || 'Failed' };
        }
        return { error: null, success: false, message: 'Unexpected error' };
    }
}

export async function endMeetingApi(serviceId: string): Promise<ApiResponse<{ message: string }>> {
    try {
        const response = await axiosInstance.post<BackendResponse<{ message: string }>>(VIDEO_ROUTES.END_MEETING(serviceId), {}, { withCredentials: true });
        if (!response.data.success) {
            return { error: response.data.error || null, success: false, message: response.data.message || "Failed" };
        }
        return { payload: response.data.payload as { message: string }, success: true, message: response.data.message || "Success" };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data?.error || null, success: false, message: error.response?.data?.message || 'Failed' };
        }
        return { error: null, success: false, message: 'Unexpected error' };
    }
}
