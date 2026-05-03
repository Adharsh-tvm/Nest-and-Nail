import { Transaction } from "../entities/Transaction";

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;


  findByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    transactions: Transaction[];
    total: number;
    totalPages: number;
  }>;

  findByWalletId(
    walletId: string,
    page: number,
    limit: number
  ): Promise<{
    transactions: Transaction[];
    total: number;
    totalPages: number;
  }>;

  findAll(
    page: number,
    limit: number
  ): Promise<{
    transactions: Transaction[];
    total: number;
    totalPages: number;
  }>;
}
