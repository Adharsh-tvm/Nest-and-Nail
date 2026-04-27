import { Transaction } from "../../domain/entities/Transaction";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { TransactionModel } from "../database/models/TransactionModel";

export class TransactionRepository implements ITransactionRepository {
  async create(transaction: Transaction): Promise<Transaction> {
    const created = await TransactionModel.create(transaction);
    return created.toObject();
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return TransactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findByWalletId(walletId: string): Promise<Transaction[]> {
    return TransactionModel.find({ walletId })
      .sort({ createdAt: -1 })
      .lean();
  }
}