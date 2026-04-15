"use server";

import { getWalletBalanceApi, WalletData } from "@/sources/api/wallet.api";

export async function getWalletBalanceAction(): Promise<{
    success: boolean;
    data?: WalletData;
    error?: string;
}> {
    try {
        const res = await getWalletBalanceApi();
        // getWalletBalanceApi now returns unwrapped WalletData directly
        if (!res) {
            return { success: false, error: "Failed to fetch wallet balance" };
        }
        return { success: true, data: res };
    } catch (error: any) {
        console.error("getWalletBalanceAction error:", error);
        return { success: false, error: error.message || "Failed to fetch wallet balance" };
    }
}
