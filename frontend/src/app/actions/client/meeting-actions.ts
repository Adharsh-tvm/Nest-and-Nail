"use server";

import { getClientScheduledMeetingsApi, getClientMeetingsHistoryApi, getClientMeetingByIdApi, endMeetingApi, joinMeetingApi, leaveMeetingApi } from "@/sources/api/client/meeting.api";
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

export async function joinMeetingAction(serviceId: string): Promise<{ success: boolean; data?: { roomId: string }; error?: string }> {
    try {
        const response = await joinMeetingApi(serviceId);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to join meeting" };
    }
}

export async function leaveMeetingAction(serviceId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        const response = await leaveMeetingApi(serviceId);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to leave meeting" };
    }
}

export async function endMeetingAction(serviceId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        const response = await endMeetingApi(serviceId);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to end meeting" };
    }
}
