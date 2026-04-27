import { Transaction } from "../entities/Transaction";

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;

  findByUserId(userId: string): Promise<Transaction[]>;

  findByWalletId(walletId: string): Promise<Transaction[]>;
}