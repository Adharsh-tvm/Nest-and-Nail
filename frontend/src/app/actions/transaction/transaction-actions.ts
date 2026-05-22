"use server";

import { getClientTransactionsApi, getWorkerTransactionsApi, getAdminTransactionsApi } from "@/sources/api/transaction/transaction.api";

export async function getClientTransactionsAction(page: number = 1, limit: number = 10) {
    try {
        const response = await getClientTransactionsApi(page, limit);
        if (!response || !response.success) {
            return { success: false, error: response?.message || "Failed to fetch transactions" };
        }
        return { success: true, data: response.payload };
    } catch (error: unknown) {
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to fetch transactions" };
    }
}

export async function getWorkerTransactionsAction(page: number = 1, limit: number = 10) {
    try {
        const response = await getWorkerTransactionsApi(page, limit);
        if (!response || !response.success) {
            return { success: false, error: response?.message || "Failed to fetch transactions" };
        }
        return { success: true, data: response.payload };
    } catch (error: unknown) {
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to fetch transactions" };
    }
}

export async function getAdminTransactionsAction(page: number = 1, limit: number = 10) {
    try {
        const response = await getAdminTransactionsApi(page, limit);
        if (!response || !response.success) {
            return { success: false, error: response?.message || "Failed to fetch transactions" };
        }
        return { success: true, data: response.payload };
    } catch (error: unknown) {
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to fetch transactions" };
    }
}
