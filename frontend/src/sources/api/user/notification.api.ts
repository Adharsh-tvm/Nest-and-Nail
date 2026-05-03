import axiosInstance from "@/lib/axiosInstance";
import { NOTIFICATION_ROUTES } from "@/sources/constant-api";
import axios from "axios";

interface BackendResponse<T> {
  success: boolean;
  payload?: T;
  message?: string;
  error?: string;
}

export interface NotificationDTO {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export async function getNotificationsApi(): Promise<{
  success: boolean;
  data?: NotificationDTO[];
  error?: string;
}> {
  try {
    const response = await axiosInstance.get<BackendResponse<NotificationDTO[]>>(
      NOTIFICATION_ROUTES.GET,
      { withCredentials: true }
    );
    if (!response.data.success) {
      return { success: false, error: response.data.message || "Failed to fetch notifications" };
    }
    return { success: true, data: response.data.payload };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch notifications",
      };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function markNotificationReadApi(notificationId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await axiosInstance.patch<BackendResponse<null>>(
      NOTIFICATION_ROUTES.MARK_READ(notificationId),
      {},
      { withCredentials: true }
    );
    if (!response.data.success) {
      return { success: false, error: response.data.message || "Failed to mark notification" };
    }
    return { success: true };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to mark notification",
      };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
