import { Transaction } from "../../../domain/entities/Transaction";

export interface IGetTransactionsUseCase {
  execute(userId: string): Promise<Transaction[]>;
}