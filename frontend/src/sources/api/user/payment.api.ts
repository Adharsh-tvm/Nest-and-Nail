import axiosInstance from "@/lib/axiosInstance";
import { PAYMENT_ROUTES } from "@/sources/constant-api";
import axios from "axios";

export interface IVerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const createPaymentOrderApi = async (serviceId: string) => {
    try {
        const response = await axiosInstance.post(PAYMENT_ROUTES.CREATE_ORDER, { serviceId });
        return { success: true, payload: response.data };
    } catch (error: unknown) {
        console.error("createPaymentOrderApi error:", error);
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
        return { success: false, message: message || "Failed to create payment order" };
    }
};

export const verifyPaymentApi = async (paymentData: IVerifyPaymentData) => {
    try {
        const response = await axiosInstance.post(PAYMENT_ROUTES.VERIFY, paymentData);
        return { success: true, payload: response.data };
    } catch (error: unknown) {
        console.error("verifyPaymentApi error:", error);
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
        return { success: false, message: message || "Failed to verify payment" };
    }
};

export const processWalletPaymentApi = async (serviceId: string) => {
    try {
        const response = await axiosInstance.post(PAYMENT_ROUTES.WALLET_PAYMENT, { serviceId });
        return { success: true, payload: response.data };
    } catch (error: unknown) {
        console.error("processWalletPaymentApi error:", error);
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
        return { success: false, message: message || "Insufficient wallet balance" };
    }
};
