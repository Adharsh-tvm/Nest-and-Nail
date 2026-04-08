"use server";

import { getWorkerScheduledMeetingsApi, getWorkerMeetingsHistoryApi, getWorkerMeetingByIdApi } from "@/sources/api/worker/meeting.api";
import { ServiceResponseDTO } from "@/shared/types/serviceTypes";

export async function getWorkerScheduledMeetingsAction(): Promise<{ success: boolean; data?: ServiceResponseDTO[]; error?: string }> {
    try {
        const response = await getWorkerScheduledMeetingsApi();
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch scheduled meetings" };
    }
}

export async function getWorkerMeetingsHistoryAction(): Promise<{ success: boolean; data?: ServiceResponseDTO[]; error?: string }> {
    try {
        const response = await getWorkerMeetingsHistoryApi();
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch meeting history" };
    }
}

export async function getWorkerMeetingByIdAction(serviceId: string): Promise<{ success: boolean; data?: ServiceResponseDTO; error?: string }> {
    try {
        const response = await getWorkerMeetingByIdApi(serviceId);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch meeting details" };
    }
}
