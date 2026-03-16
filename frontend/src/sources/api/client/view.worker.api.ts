import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { User, UserQueryParams } from "@/shared/types/userTypes";
import axios from 'axios';

export async function getAvailableWorkersApi(
    category?: string,
    lat?: number,
    lng?: number
): Promise<ApiResponse<User[]>> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (lat) params.append('lat', lat.toString());
    if (lng) params.append('lng', lng.toString());
    
    const queryStr = params.toString();
    const url = `/api/client/workers${queryStr ? `?${queryStr}` : ''}`;
    
    try {
        const response = await axiosInstance.get<ApiResponse<User[]>>(url, { withCredentials: true });
        
        // If the API returns success: false, we still want to propagate that as a successful API call but with an error message
        if (!response.data.success) {
            return {
                error: response.data.error || null,
                success: false,
                message: response.data.message || "Failed to fetch workers",
            };
        }
        
        return {
            payload: response.data.payload,
            success: true,
            message: response.data.message || "Workers fetched successfully",
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return {
                error: error.response?.data?.error || null,
                success: false,
                message: error.response?.data?.message || 'Failed to fetch workers',
            };
        }
        return {
            error: null,
            success: false,
            message: 'An unexpected error occurred',
        };
    }
}

export async function getWorkerDetailApi(id: string): Promise<ApiResponse<User>> { // Changed return type to ApiResponse<User>
    try {
        const response = await axiosInstance.get<ApiResponse<User>>(`/api/client/workers/${id}`, { withCredentials: true });
        
        // If the API returns success: false, we still want to propagate that as a successful API call but with an error message
        if (!response.data.success) {
            return {
                error: response.data.error || null,
                success: false,
                message: response.data.message || "Failed to fetch worker details",
            };
        }
        
        return {
            payload: response.data.payload,
            success: true,
            message: response.data.message || "Worker details fetched successfully",
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return {
                error: error.response?.data?.error || null,
                success: false,
                message: error.response?.data?.message || 'Failed to fetch worker details',
            };
        }
        return {
            error: null,
            success: false,
            message: 'An unexpected error occurred',
        };
    }
}
