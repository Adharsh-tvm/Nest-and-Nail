"use server";

import { getWalletBalanceApi, WalletData } from "@/sources/api/user/wallet.api";

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

export async function getTransactionsAction() {
    try {
        const { getTransactionsApi } = require("@/sources/api/user/wallet.api");
        const res = await getTransactionsApi();
        return { success: true, data: res };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch transactions" };
    }
}

export async function createRechargeOrderAction(amount: number) {
    try {
        const { createRechargeOrderApi } = require("@/sources/api/user/wallet.api");
        const res = await createRechargeOrderApi(amount);
        return { success: true, data: res };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to create order" };
    }
}

export async function verifyRechargePaymentAction(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount: number;
}) {
    try {
        const { verifyRechargePaymentApi } = require("@/sources/api/user/wallet.api");
        const res = await verifyRechargePaymentApi(data);
        return { success: true, data: res };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to verify payment" };
    }
}
