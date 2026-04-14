"use server";

import { AdminServiceResponseDTO } from "@/shared/types/serviceTypes";
import { fetchAdminMeetingDetails, fetchAllAdminMeetings } from "@/sources/api/admin.api";

export async function getAdminMeetingsAction(): Promise<{ success: boolean; data?: AdminServiceResponseDTO[]; error?: string }> {
    try {
        const response = await fetchAllAdminMeetings();
        return { success: true, data: response };
    } catch (error: any) {
        console.error("Failed to fetch admin meetings", error);
        return { success: false, error: error.message || "Failed to fetch admin meetings" };
    }
}

export async function getAdminMeetingDetailsAction(serviceId: string): Promise<{ success: boolean; data?: AdminServiceResponseDTO; error?: string }> {
    try {
        const response = await fetchAdminMeetingDetails(serviceId);
        return { success: true, data: response };
    } catch (error: any) {
        console.error("Failed to fetch admin meeting details", error);
        return { success: false, error: error.message || "Failed to fetch admin meeting details" };
    }
}
