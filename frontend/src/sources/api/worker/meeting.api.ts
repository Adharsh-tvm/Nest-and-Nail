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

export async function getWorkerScheduledMeetingsApi(): Promise<ApiResponse<ServiceResponseDTO[]>> {
    try {
        const response = await axiosInstance.get<BackendResponse<ServiceResponseDTO[]>>('/api/worker/meetings/scheduled', { withCredentials: true });
        
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

export async function getWorkerMeetingsHistoryApi(): Promise<ApiResponse<ServiceResponseDTO[]>> {
    try {
        const response = await axiosInstance.get<BackendResponse<ServiceResponseDTO[]>>('/api/worker/meetings/history', { withCredentials: true });
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

export async function getWorkerMeetingByIdApi(serviceId: string): Promise<ApiResponse<ServiceResponseDTO>> {
    try {
        const response = await axiosInstance.get<BackendResponse<ServiceResponseDTO>>(`/api/worker/meetings/${serviceId}`, { withCredentials: true });
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
        const response = await axiosInstance.post<BackendResponse<{ message: string }>>(`/api/video-call/end/${serviceId}`, {}, { withCredentials: true });
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
