import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";

interface BackendResponse<T> {
  success: boolean;
  payload?: T;
  message?: string;
  error?: string;
}

export interface ConcernDTO {
  concernId: string;
  serviceId: string;
  userId: string;
  raisedBy: "CLIENT" | "WORKER";
  message: string;
  status: "OPEN" | "RESOLVED" | "REJECTED";
  createdAt: string;
}

export async function raiseConcernApi(
  serviceId: string,
  message: string
): Promise<{ success: boolean; data?: ConcernDTO; message?: string; error?: string }> {
  try {
    const response = await axiosInstance.post<BackendResponse<ConcernDTO>>(
      "/api/concerns",
      { serviceId, message },
      { withCredentials: true }
    );
    if (!response.data.success) {
      return { success: false, error: response.data.message || "Failed to raise concern" };
    }
    return { success: true, data: response.data.payload };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to raise concern",
      };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
