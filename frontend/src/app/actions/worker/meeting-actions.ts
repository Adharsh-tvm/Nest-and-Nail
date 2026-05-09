"use server";

import { getWorkerScheduledMeetingsApi, getWorkerMeetingsHistoryApi, getWorkerMeetingByIdApi, endMeetingApi, joinMeetingApi, leaveMeetingApi } from "@/sources/api/worker/meeting.api";
import { ServiceResponseDTO } from "@/shared/types/serviceTypes";

export async function getWorkerScheduledMeetingsAction(): Promise<{ success: boolean; data?: ServiceResponseDTO[]; error?: string }> {
    try {
        const response = await getWorkerScheduledMeetingsApi();
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: unknown) {
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to fetch scheduled meetings" };
    }
}

export async function getWorkerMeetingsHistoryAction(): Promise<{ success: boolean; data?: ServiceResponseDTO[]; error?: string }> {
    try {
        const response = await getWorkerMeetingsHistoryApi();
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: unknown) {
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to fetch meeting history" };
    }
}

export async function getWorkerMeetingByIdAction(serviceId: string): Promise<{ success: boolean; data?: ServiceResponseDTO; error?: string }> {
    try {
        const response = await getWorkerMeetingByIdApi(serviceId);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: unknown) {
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to fetch meeting details" };
    }
}

export async function joinMeetingAction(serviceId: string): Promise<{ success: boolean; data?: { roomId: string }; error?: string }> {
    try {
        const response = await joinMeetingApi(serviceId);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: unknown) {
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to join meeting" };
    }
}

export async function leaveMeetingAction(serviceId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        const response = await leaveMeetingApi(serviceId);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, message: response.message };
    } catch (error: unknown) {
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to leave meeting" };
    }
}

export async function endMeetingAction(serviceId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        const response = await endMeetingApi(serviceId);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, message: response.message };
    } catch (error: unknown) {
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to end meeting" };
    }
}
