"use server";

import { getClientScheduledMeetingsApi, getClientMeetingsHistoryApi, getClientMeetingByIdApi } from "@/sources/api/client/meeting.api";
import { ServiceResponseDTO } from "@/shared/types/serviceTypes";

export async function getClientScheduledMeetingsAction(): Promise<{ success: boolean; data?: ServiceResponseDTO[]; error?: string }> {
    try {
        const response = await getClientScheduledMeetingsApi();
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch scheduled meetings" };
    }
}

export async function getClientMeetingsHistoryAction(): Promise<{ success: boolean; data?: ServiceResponseDTO[]; error?: string }> {
    try {
        const response = await getClientMeetingsHistoryApi();
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch meeting history" };
    }
}

export async function getClientMeetingByIdAction(serviceId: string): Promise<{ success: boolean; data?: ServiceResponseDTO; error?: string }> {
    try {
        const response = await getClientMeetingByIdApi(serviceId);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch meeting details" };
    }
}
