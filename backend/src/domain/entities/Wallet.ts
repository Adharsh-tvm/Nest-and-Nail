export interface Wallet {
    walletId: string;
    userId: string;
    balance: number;
    currency: "INR";
    createdAt: Date;
    updatedAt: Date;
}
