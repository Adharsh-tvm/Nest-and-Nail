import axiosInstance from "@/lib/axiosInstance";

export type WalletResponse = {
    success: boolean;
    walletId: string;
    userId: string;
    balance: number;
    currency: "INR";
};

export const getWalletBalanceApi = async (): Promise<WalletResponse> => {
    const response = await axiosInstance.get("/api/wallet/balance");
    return response.data;
};
