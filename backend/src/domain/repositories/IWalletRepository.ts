import { Wallet } from "../entities/Wallet";

export interface IWalletRepository {
    findByUserId(userId: string): Promise<Wallet | null>;
    create(wallet: Omit<Wallet, "createdAt" | "updatedAt">): Promise<Wallet>;
    updateBalance(userId: string, balance: number): Promise<Wallet | null>;
    creditBalance(userId: string, amount: number): Promise<Wallet | null>;
    debitBalance(userId: string, amount: number): Promise<Wallet | null>;
}
