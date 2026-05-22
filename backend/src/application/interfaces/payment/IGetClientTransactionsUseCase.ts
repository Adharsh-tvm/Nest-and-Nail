import { Transaction } from "../../../domain/entities/Transaction";

export interface IGetClientTransactionsUseCase {
    execute(
        userId: string,
        page: number,
        limit: number
    ): Promise<{
        transactions: Transaction[];
        total: number;
        totalPages: number;
    }>;
}