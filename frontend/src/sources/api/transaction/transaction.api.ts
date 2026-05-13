import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";

export const getClientTransactionsApi = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axiosInstance.get(`/api/transactions/client?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: unknown) {
        console.error("getClientTransactionsApi error:", error);
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
        return { success: false, message: message || "Failed to fetch transactions" };
    }
};

export const getWorkerTransactionsApi = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axiosInstance.get(`/api/transactions/worker?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: unknown) {
        console.error("getWorkerTransactionsApi error:", error);
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
        return { success: false, message: message || "Failed to fetch transactions" };
    }
};

export const getAdminTransactionsApi = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axiosInstance.get(`/api/transactions/admin?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: unknown) {
        console.error("getAdminTransactionsApi error:", error);
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
        return { success: false, message: message || "Failed to fetch transactions" };
    }
};
