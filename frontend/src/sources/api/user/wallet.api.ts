import axiosInstance from "@/lib/axiosInstance";
import { WALLET_ROUTES } from "@/sources/constant-api";

export type WalletData = {
    walletId: string;
    userId: string;
    balance: number;
    currency: "INR";
};

export type WalletResponse = {
    success: boolean;
    message: string;
    payload: WalletData;
};

export const getWalletBalanceApi = async (): Promise<WalletData> => {
    const response = await axiosInstance.get(WALLET_ROUTES.BALANCE);
    // Backend wraps data as: { success, message, payload: actualData }
    return response.data?.payload ?? response.data;
};

export const getTransactionsApi = async () => {
    const response = await axiosInstance.get(WALLET_ROUTES.TRANSACTIONS);
    return response.data?.payload ?? response.data;
};

export const createRechargeOrderApi = async (amount: number) => {
    const response = await axiosInstance.post(WALLET_ROUTES.RECHARGE_ORDER, { amount });
    return response.data?.payload ?? response.data;
};

export const verifyRechargePaymentApi = async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount: number;
}) => {
    const response = await axiosInstance.post(WALLET_ROUTES.VERIFY_RECHARGE, data);
    return response.data?.payload ?? response.data;
};
