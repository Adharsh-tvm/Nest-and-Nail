import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import { Wallet } from "../../domain/entities/Wallet";
import { WalletModel, IWalletDocument } from "../database/models/WalletModel";
import { v4 as uuidv4 } from "uuid";

export class WalletRepository implements IWalletRepository {

    private toEntity(doc: IWalletDocument): Wallet {
        return {
            walletId: doc.walletId,
            userId: doc.userId,
            balance: doc.balance,
            currency: doc.currency,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }

    async findByUserId(userId: string): Promise<Wallet | null> {
        const doc = await WalletModel.findOne({ userId });
        if (!doc) return null;
        return this.toEntity(doc);
    }

    async create(wallet: Omit<Wallet, "createdAt" | "updatedAt">): Promise<Wallet> {
        const doc = await WalletModel.create({
            walletId: wallet.walletId || uuidv4(),
            userId: wallet.userId,
            balance: wallet.balance ?? 0,
            currency: wallet.currency ?? "INR",
        });
        return this.toEntity(doc);
    }

    async creditBalance(userId: string, amount: number): Promise<Wallet> {
        const doc = await WalletModel.findOneAndUpdate(
            { userId },
            { $inc: { balance: amount } },
            { new: true }
        );

        if (!doc) {
            throw new Error("Wallet not found");
        }

        return this.toEntity(doc);
    }

    async debitBalance(userId: string, amount: number): Promise<Wallet> {
        const doc = await WalletModel.findOneAndUpdate(
            {
                userId,
                balance: { $gte: amount }
            },
            {
                $inc: { balance: -amount }
            },
            { new: true }
        );

        if (!doc) {
            throw new Error("Insufficient wallet balance");
        }

        return this.toEntity(doc);
    }
}
