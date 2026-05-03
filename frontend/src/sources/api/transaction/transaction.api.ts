import axiosInstance from "@/lib/axiosInstance";

export const getClientTransactionsApi = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axiosInstance.get(`/api/transactions/client?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: any) {
        console.error("getClientTransactionsApi error:", error);
        return { success: false, message: error.response?.data?.message || "Failed to fetch transactions" };
    }
};

export const getWorkerTransactionsApi = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axiosInstance.get(`/api/transactions/worker?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: any) {
        console.error("getWorkerTransactionsApi error:", error);
        return { success: false, message: error.response?.data?.message || "Failed to fetch transactions" };
    }
};

export const getAdminTransactionsApi = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axiosInstance.get(`/api/transactions/admin?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: any) {
        console.error("getAdminTransactionsApi error:", error);
        return { success: false, message: error.response?.data?.message || "Failed to fetch transactions" };
    }
};
