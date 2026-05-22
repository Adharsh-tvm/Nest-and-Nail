"use server";
 
import {
    getWalletBalanceApi,
    WalletData,
    getTransactionsApi,
    createRechargeOrderApi,
    verifyRechargePaymentApi
} from "@/sources/api/user/wallet.api";
 
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
    } catch (error: unknown) {
        console.error("getWalletBalanceAction error:", error);
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to fetch wallet balance" };
    }
}
 
export async function getTransactionsAction(page: number = 1, limit: number = 10) {
    try {
        const res = await getTransactionsApi(page, limit);
        return { success: true, data: res };
    } catch (error: unknown) {
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to fetch transactions" };
    }
}
 
export async function createRechargeOrderAction(amount: number) {
    try {
        const res = await createRechargeOrderApi(amount);
        return { success: true, data: res };
    } catch (error: unknown) {
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to create order" };
    }
}
 
export async function verifyRechargePaymentAction(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount: number;
}) {
    try {
        const res = await verifyRechargePaymentApi(data);
        return { success: true, data: res };
    } catch (error: unknown) {
        return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to verify payment" };
    }
}
