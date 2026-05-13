import { Transaction } from "../../domain/entities/Transaction";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { TransactionModel } from "../database/models/TransactionModel";

export class TransactionRepository implements ITransactionRepository {
  async create(transaction: Transaction): Promise<Transaction> {
    const created = await TransactionModel.create(transaction);
    return created.toObject();
  }

  async findByUserId(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      TransactionModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      TransactionModel.countDocuments({ userId })
    ]);

    return {
      transactions,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findByWalletId(walletId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      TransactionModel.find({ walletId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      TransactionModel.countDocuments({ walletId })
    ]);

    return {
      transactions,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      TransactionModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      TransactionModel.countDocuments()
    ]);

    return {
      transactions,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }
}