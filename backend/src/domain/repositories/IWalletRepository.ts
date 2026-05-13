import { Wallet } from "../entities/Wallet";

export interface IWalletRepository {
    findByUserId(userId: string): Promise<Wallet | null>;
    create(wallet: Omit<Wallet, "createdAt" | "updatedAt">): Promise<Wallet>;

    creditBalance(userId: string, amount: number): Promise<Wallet>;
    debitBalance(userId: string, amount: number): Promise<Wallet>;
}
