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
