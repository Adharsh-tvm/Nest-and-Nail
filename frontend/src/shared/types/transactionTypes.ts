export type TransactionType = "CREDIT" | "DEBIT";
export type TransactionSource = "RAZORPAY" | "ESCROW" | "REFUND" | "SERVICE_PAYMENT";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Transaction {
    transactionId: string;
    walletId: string;
    userId: string;
    type: TransactionType;
    amount: number;
    source: TransactionSource;
    serviceId?: string;
    status: TransactionStatus;
    createdAt: string; // Serialized Date from API
}

export interface TransactionListResponse {
    transactions: Transaction[];
    total: number;
    totalPages: number;
}
