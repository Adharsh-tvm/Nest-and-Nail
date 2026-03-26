"use server";

import { getActiveWorkerServiceApi, getWorkerServicesApi } from "@/sources/api/worker/service.api";
import { ServiceResponseDTO } from "@/shared/types/serviceTypes";

export async function getActiveWorkerServiceAction(): Promise<{ success: boolean; data?: ServiceResponseDTO | null; error?: string }> {
    try {
        const response = await getActiveWorkerServiceApi();
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: any) {
        console.error("Failed to fetch active worker service", error);
        return { success: false, error: error.message || "Failed to fetch active worker service" };
    }
}

export async function getWorkerServicesAction(status?: string): Promise<{ success: boolean; data?: ServiceResponseDTO[]; error?: string }> {
    try {
        const response = await getWorkerServicesApi(status);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: any) {
        console.error("Failed to fetch worker services", error);
        return { success: false, error: error.message || "Failed to fetch worker services" };
    }
}
