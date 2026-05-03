import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IGetWorkerTransactionsUseCase } from "../../interfaces/payment/IGetWorkerTransactionsUseCase";

export class GetWorkerTransactionsUseCase implements IGetWorkerTransactionsUseCase {
  constructor(
    private readonly _transactionRepository: ITransactionRepository
  ) {}

  async execute(workerId: string, page: number, limit: number) {
    return this._transactionRepository.findByUserId(workerId, page, limit);
  }
}