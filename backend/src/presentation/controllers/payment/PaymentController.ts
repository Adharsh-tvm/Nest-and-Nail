import { Request, Response } from "express";
import { ICreatePaymentUseCase } from "../../../application/interfaces/payment/ICreatePaymentUseCase";
import { IVerifyPaymentUseCase } from "../../../application/interfaces/payment/IVerifyPaymentUseCase";
import { ProcessWalletPaymentUseCase } from "../../../application/use-cases/payment/ProcessWalletPaymentUseCase";

export class PaymentController {
  constructor(
    private createOrderUseCase: ICreatePaymentUseCase,
    private verifyPaymentUseCase: IVerifyPaymentUseCase,
    private processWalletPaymentUseCase: ProcessWalletPaymentUseCase
  ) {}

  createOrder = async (req: Request, res: Response) => {
    const { serviceId } = req.body;
    const clientId = req.user.id;

    const order = await this.createOrderUseCase.execute(
      serviceId,
      clientId
    );

    res.json(order);
  };

  verify = async (req : Request, res: Response) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const result = await this.verifyPaymentUseCase.execute({
        paymentId: razorpay_payment_id || req.body.paymentId,
        orderId: razorpay_order_id || req.body.orderId,
        signature: razorpay_signature || req.body.signature
    });

    res.json(result);
  };

  processWalletPayment = async (req: Request, res: Response) => {
    try {
      const { serviceId } = req.body;
      const clientId = req.user.id;

      const result = await this.processWalletPaymentUseCase.execute(serviceId, clientId);

      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "Insufficient wallet balance") {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message || "Failed to process wallet payment" });
      }
    }
  };
}