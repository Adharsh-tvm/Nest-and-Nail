import { Transaction } from "../../../domain/entities/Transaction";

export interface IGetWorkerTransactionsUseCase {
    execute(
        workerId: string,
        page: number,
        limit: number
    ): Promise<{
        transactions: Transaction[];
        total: number;
        totalPages: number;
    }>;
}