import axiosInstance from "@/lib/axiosInstance";
import { CONCERN_ROUTES } from "@/sources/constant-api";
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
  images?: string[];
}

export async function raiseConcernApi(
  serviceId: string,
  message: string,
  files?: File[]
): Promise<{ success: boolean; data?: ConcernDTO; message?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("serviceId", serviceId);
    formData.append("message", message);
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await axiosInstance.post<BackendResponse<ConcernDTO>>(
      CONCERN_ROUTES.CREATE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    if (!response.data.success) {
      return { success: false, error: response.data.message || "Failed to raise concern" };
    }
    return { success: true, data: response.data.payload };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 413) {
        return {
          success: false,
          error: "One or more attachment images are too large for the backend server. Please upload smaller images.",
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || `Failed to raise concern (Status ${error.response?.status || "Network Error"}).`,
      };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
