import axiosInstance from "@/lib/axiosInstance";

export const createPaymentOrderApi = async (serviceId: string) => {
    try {
        const response = await axiosInstance.post("/api/payment/create-order", { serviceId });
        return { success: true, payload: response.data };
    } catch (error: any) {
        console.error("createPaymentOrderApi error:", error);
        return { success: false, message: error.response?.data?.message || "Failed to create payment order" };
    }
};

export const verifyPaymentApi = async (paymentData: any) => {
    try {
        const response = await axiosInstance.post("/api/payment/verify", paymentData);
        return { success: true, payload: response.data };
    } catch (error: any) {
        console.error("verifyPaymentApi error:", error);
        return { success: false, message: error.response?.data?.message || "Failed to verify payment" };
    }
};

export const processWalletPaymentApi = async (serviceId: string) => {
    try {
        const response = await axiosInstance.post("/api/payment/wallet", { serviceId });
        return { success: true, payload: response.data };
    } catch (error: any) {
        console.error("processWalletPaymentApi error:", error);
        return { success: false, message: error.response?.data?.message || "Insufficient wallet balance" };
    }
};
