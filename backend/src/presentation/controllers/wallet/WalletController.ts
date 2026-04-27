import { Request, Response } from "express";
import { IGetWalletBalanceUseCase } from "../../../application/interfaces/payment/IGetWalletBalanceUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";
import { IGetTransactionsUseCase } from "../../../application/interfaces/payment/IGetTransactionsUseCase";

export class WalletController {
  constructor(
    private readonly _getWalletBalanceUseCase: IGetWalletBalanceUseCase,
    private readonly _getTransactionsUseCase: IGetTransactionsUseCase
  ) { }

  getBalance = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
      );
      return;
    }

    const wallet = await this._getWalletBalanceUseCase.execute(userId);

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(
        {
          walletId: wallet.walletId,
          userId: wallet.userId,
          balance: wallet.balance,
          currency: wallet.currency,
        },
        "Wallet balance fetched successfully"
      )
    );
  };

  getTransactions = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
      );
      return;
    }

    const transactions = await this._getTransactionsUseCase.execute(userId);

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(
        transactions,
        "Transactions fetched successfully"
      )
    );
  };
}