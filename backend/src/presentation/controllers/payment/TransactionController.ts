import { Request, Response } from "express";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { IGetClientTransactionsUseCase } from "../../../application/interfaces/payment/IGetClientTransactionsUseCase";
import { IGetWorkerTransactionsUseCase } from "../../../application/interfaces/payment/IGetWorkerTransactionsUseCase";
import { IGetAllTransactionsUseCase } from "../../../application/interfaces/payment/IGetAllTransactionsUseCase";

export class TransactionController {
  constructor(
    private readonly _getClientTransactionsUseCase: IGetClientTransactionsUseCase,
    private readonly _getWorkerTransactionsUseCase: IGetWorkerTransactionsUseCase,
    private readonly _getAllTransactionsUseCase: IGetAllTransactionsUseCase
  ) {}

  async getClientTransactions(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(HttpStatusCode.UNAUTHORIZED).json(
          ResponseHandler.error("Unauthorized")
        );
        return;
      }

      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const result = await this._getClientTransactionsUseCase.execute(
        userId,
        page,
        limit
      );

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(result, "Transactions fetched")
      );
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER).json(
        ResponseHandler.error("Failed to fetch transactions")
      );
    }
  }

  async getWorkerTransactions(req: Request, res: Response): Promise<void> {
    try {
      const workerId = req.user?.id;
      if (!workerId) {
        res.status(HttpStatusCode.UNAUTHORIZED).json(
          ResponseHandler.error("Unauthorized")
        );
        return;
      }

      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const result = await this._getWorkerTransactionsUseCase.execute(
        workerId,
        page,
        limit
      );

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(result, "Transactions fetched")
      );
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER).json(
        ResponseHandler.error("Failed to fetch transactions")
      );
    }
  }

  async getAllTransactions(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const result = await this._getAllTransactionsUseCase.execute(
        page,
        limit
      );

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(result, "Transactions fetched")
      );
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER).json(
        ResponseHandler.error("Failed to fetch transactions")
      );
    }
  }
}