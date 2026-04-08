"use server";

import {
  getActiveWorkerServiceApi,
  getWorkerServicesApi,
  getWorkerServiceDetailsApi,
  startWorkerServiceApi,
  completeWorkerServiceApi,
} from "@/sources/api/worker/service.api";
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

export async function getWorkerServiceDetailsAction(serviceId: string): Promise<{ success: boolean; data?: ServiceResponseDTO | null; error?: string }> {
    try {
        const response = await getWorkerServiceDetailsApi(serviceId);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: any) {
        console.error("Failed to fetch worker service details", error);
        return { success: false, error: error.message || "Failed to fetch worker service details" };
    }
}

export async function startWorkerServiceAction(
    serviceId: string,
    lat: number,
    lng: number
): Promise<{ success: boolean; data?: ServiceResponseDTO | null; error?: string }> {
    try {
        const response = await startWorkerServiceApi(serviceId, lat, lng);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: any) {
        console.error("Failed to start worker service", error);
        return { success: false, error: error.message || "Failed to start service" };
    }
}

export async function completeWorkerServiceAction(
    serviceId: string
): Promise<{ success: boolean; data?: ServiceResponseDTO | null; error?: string }> {
    try {
        const response = await completeWorkerServiceApi(serviceId);
        if (!response.success) {
            return { success: false, error: response.message };
        }
        return { success: true, data: response.payload };
    } catch (error: any) {
        console.error("Failed to complete worker service", error);
        return { success: false, error: error.message || "Failed to complete service" };
    }
}
