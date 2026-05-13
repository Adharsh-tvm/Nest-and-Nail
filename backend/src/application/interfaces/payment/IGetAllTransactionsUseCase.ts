import { Transaction } from "../../../domain/entities/Transaction";

export interface IGetAllTransactionsUseCase {
    execute(
        page: number,
        limit: number
    ): Promise<{
        transactions: Transaction[];
        total: number;
        totalPages: number;
    }>;
}