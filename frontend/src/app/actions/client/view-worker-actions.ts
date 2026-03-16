"use server";

import { getAvailableWorkersApi, getWorkerDetailApi } from "@/sources/api/client/view.worker.api";
import { User } from "@/shared/types/userTypes";

export async function getAvailableWorkersAction(
    category?: string,
    lat?: number,
    lng?: number
): Promise<{ success: boolean; data?: User[]; error?: string }> {
    try {
        const workerResponse = await getAvailableWorkersApi(category, lat, lng);
        if (!workerResponse.success) {
            return { success: false, error: workerResponse.message };
        }
        return { success: true, data: workerResponse.payload };
    } catch (error: any) {
        console.error("Failed to fetch available workers", error);
        return { success: false, error: error.message || "Failed to fetch available workers" };
    }
}

export async function getWorkerDetailAction(
    id: string
): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
        const workerResponse = await getWorkerDetailApi(id);
        if (!workerResponse.success) {
            return { success: false, error: workerResponse.message };
        }
        return { success: true, data: workerResponse.payload };
    } catch (error: any) {
        console.error(`Failed to fetch worker detail for id ${id}`, error);
        return { success: false, error: error.message || "Failed to fetch worker details" };
    }
}
