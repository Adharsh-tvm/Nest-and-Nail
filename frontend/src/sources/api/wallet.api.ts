import axiosInstance from "@/lib/axiosInstance";

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
    const response = await axiosInstance.get("/api/wallet/balance");
    // Backend wraps data as: { success, message, payload: actualData }
    return response.data?.payload ?? response.data;
};

export const getTransactionsApi = async () => {
    const response = await axiosInstance.get("/api/wallet/transactions");
    return response.data?.payload ?? response.data;
};

export const createRechargeOrderApi = async (amount: number) => {
    const response = await axiosInstance.post("/api/wallet/recharge/create-order", { amount });
    return response.data?.payload ?? response.data;
};

export const verifyRechargePaymentApi = async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount: number;
}) => {
    const response = await axiosInstance.post("/api/wallet/recharge/verify", data);
    return response.data?.payload ?? response.data;
};
