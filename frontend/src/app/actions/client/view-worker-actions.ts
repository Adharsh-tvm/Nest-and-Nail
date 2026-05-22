"use server";

import { getAvailableWorkersApi, getWorkerDetailApi } from "@/sources/api/client/view.worker.api";
import { User } from "@/shared/types/userTypes";

export async function getAvailableWorkersAction(
    category?: string,
    lat?: number,
    lng?: number,
    search?: string,
    isOnline?: boolean,
    page?: number,
    limit?: number,
    sortBy?: string
): Promise<{ success: boolean; workers?: User[]; total?: number; error?: string }> {
    try {
        const workerResponse = await getAvailableWorkersApi(category, lat, lng, search, isOnline, page, limit, sortBy);
        if (!workerResponse.success) {
            return { success: false, error: workerResponse.message };
        }
        return { 
            success: true, 
            workers: workerResponse.payload?.workers, 
            total: workerResponse.payload?.total 
        };
    } catch (error: unknown) {
        console.error("Failed to fetch available workers", error);
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to fetch available workers" };
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
    } catch (error: unknown) {
        console.error(`Failed to fetch worker detail for id ${id}`, error);
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to fetch worker details" };
    }
}
