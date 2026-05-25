import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import { isDynamicServerError } from "@/lib/utils";
import { TRANSACTION_ROUTES } from "@/sources/constant-api";

export const getClientTransactionsApi = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axiosInstance.get(`${TRANSACTION_ROUTES.CLIENT}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: unknown) {
        if (isDynamicServerError(error)) {
            throw error;
        }
        console.error("getClientTransactionsApi error:", error);
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
        return { success: false, message: message || "Failed to fetch transactions" };
    }
};

export const getWorkerTransactionsApi = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axiosInstance.get(`${TRANSACTION_ROUTES.WORKER}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: unknown) {
        if (isDynamicServerError(error)) {
            throw error;
        }
        console.error("getWorkerTransactionsApi error:", error);
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
        return { success: false, message: message || "Failed to fetch transactions" };
    }
};

export const getAdminTransactionsApi = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axiosInstance.get(`${TRANSACTION_ROUTES.ADMIN}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: unknown) {
        if (isDynamicServerError(error)) {
            throw error;
        }
        console.error("getAdminTransactionsApi error:", error);
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
        return { success: false, message: message || "Failed to fetch transactions" };
    }
};
