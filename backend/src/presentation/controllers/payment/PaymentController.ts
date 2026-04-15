import { Request, Response } from "express";
import { ICreatePaymentUseCase } from "../../../application/interfaces/payment/ICreatePaymentUseCase";
import { IVerifyPaymentUseCase } from "../../../application/interfaces/payment/IVerifyPaymentUseCase";
import { ProcessWalletPaymentUseCase } from "../../../application/use-cases/payment/ProcessWalletPaymentUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";

export class PaymentController {
  constructor(
    private createOrderUseCase: ICreatePaymentUseCase,
    private verifyPaymentUseCase: IVerifyPaymentUseCase,
    private processWalletPaymentUseCase: ProcessWalletPaymentUseCase
  ) {}

  createOrder = async (req: Request, res: Response): Promise<void> => {
    const { serviceId } = req.body;
    const clientId = req.user?.id;

    if (!clientId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
      );
      return;
    }

    if (!serviceId) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, "serviceId is required")
      );
      return;
    }

    const order = await this.createOrderUseCase.execute(serviceId, clientId);

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(order, "Payment order created")
    );
  };

  verify = async (req: Request, res: Response): Promise<void> => {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      paymentId,
      orderId,
      signature
    } = req.body;

    const finalPaymentId = razorpay_payment_id || paymentId;
    const finalOrderId = razorpay_order_id || orderId;
    const finalSignature = razorpay_signature || signature;

    if (!finalPaymentId || !finalOrderId || !finalSignature) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(
          RESPONSE_MESSAGES.BAD_REQUEST,
          "Missing payment verification fields"
        )
      );
      return;
    }

    const result = await this.verifyPaymentUseCase.execute({
      paymentId: finalPaymentId,
      orderId: finalOrderId,
      signature: finalSignature
    });

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(result, "Payment verified successfully")
    );
  };

  processWalletPayment = async (req: Request, res: Response): Promise<void> => {
    const { serviceId } = req.body;
    const clientId = req.user?.id;

    if (!clientId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
      );
      return;
    }

    if (!serviceId) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, "serviceId is required")
      );
      return;
    }

    const result = await this.processWalletPaymentUseCase.execute(serviceId, clientId);

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(result, "Wallet payment successful")
    );
  };
}