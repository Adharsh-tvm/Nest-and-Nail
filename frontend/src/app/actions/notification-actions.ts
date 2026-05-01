"use server";

import { getNotificationsApi, markNotificationReadApi, NotificationDTO } from "@/sources/api/notification.api";

export async function getNotificationsAction(): Promise<{
  success: boolean;
  data?: NotificationDTO[];
  error?: string;
}> {
  try {
    const res = await getNotificationsApi();
    if (!res.success) {
      return { success: false, error: res.error };
    }
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error("getNotificationsAction error:", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
}

export async function markNotificationReadAction(notificationId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const res = await markNotificationReadApi(notificationId);
    if (!res.success) {
      return { success: false, error: res.error };
    }
    return { success: true };
  } catch (error: any) {
    console.error("markNotificationReadAction error:", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
}
