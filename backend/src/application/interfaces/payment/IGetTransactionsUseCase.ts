import { Transaction } from "../../../domain/entities/Transaction";

export interface IGetTransactionsUseCase {
  execute(userId: string, page: number, limit: number): Promise<{
    transactions: Transaction[];
    total: number;
    totalPages: number;
  }>;
}