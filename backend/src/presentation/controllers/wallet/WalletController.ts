import { Request, Response } from "express";
import { IGetWalletBalanceUseCase } from "../../../application/interfaces/payment/IGetWalletBalanceUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";
import { IGetTransactionsUseCase } from "../../../application/interfaces/payment/IGetTransactionsUseCase";
import { IVerifyRechargePaymentUseCase } from "../../../application/use-cases/payment/VerifyRechargePaymentUseCase";
import { ICreateRechargeOrderUseCase } from "../../../application/interfaces/payment/ICreateRechargeOrderUseCase";

export class WalletController {
  constructor(
    private readonly _getWalletBalanceUseCase: IGetWalletBalanceUseCase,
    private readonly _getTransactionsUseCase: IGetTransactionsUseCase,
    private readonly _createRechargeOrderUseCase: ICreateRechargeOrderUseCase,
    private readonly _verifyRechargePaymentUseCase: IVerifyRechargePaymentUseCase
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

  getBalanceByUserId = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;

    if (!userId) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error("userId is required")
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
    const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;

    if (!userId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
      );
      return;
    }

    const transactions = await this._getTransactionsUseCase.execute(userId, page, limit);

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(
        transactions,
        "Transactions fetched successfully"
      )
    );
  };

  createRechargeOrder = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { amount } = req.body as { amount?: number };

    if (!userId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED));
      return;
    }

    if (!amount || amount <= 0) {
      res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHandler.error("Invalid amount"));
      return;
    }

    try {
      const order = await this._createRechargeOrderUseCase.execute(amount, userId);
      res.status(HttpStatusCode.OK).json(ResponseHandler.success(order, "Recharge order created"));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create recharge order";
      res.status(HttpStatusCode.INTERNAL_SERVER).json(ResponseHandler.error(message));
    }
  };

  verifyRechargePayment = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      amount: number;
    };

    if (!userId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED));
      return;
    }

    try {
      const result = await this._verifyRechargePaymentUseCase.execute({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        userId,
        amount
      });

      res.status(HttpStatusCode.OK).json(ResponseHandler.success(result, "Recharge successful"));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Payment verification failed";
      res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHandler.error(message));
    }
  };
}