import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import axios from 'axios';

interface BackendResponse<T> {
  success: boolean;
  payload?: T;
  message?: string;
  error?: string;
}

export async function addReviewApi(serviceId: string, rating: number, review?: string): Promise<ApiResponse<null>> {
    try {
        const response = await axiosInstance.post<BackendResponse<null>>(
            `/api/review/${serviceId}`,
            { rating, review },
            { withCredentials: true }
        );

        if (!response.data.success) {
            return {
                error: response.data.error || null,
                success: false,
                message: response.data.message || "Failed to add review",
            };
        }

        return {
            payload: null,
            success: true,
            message: response.data.message || "Review submitted successfully",
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return {
                error: error.response?.data?.error || null,
                success: false,
                message: error.response?.data?.message || 'Failed to submit review',
            };
        }
        return {
            error: null,
            success: false,
            message: 'An unexpected error occurred',
        };
    }
}
