import { Request, Response } from "express";
import { ICreatePaymentUseCase } from "../../../application/interfaces/payment/ICreatePaymentUseCase";
import { IVerifyPaymentUseCase } from "../../../application/interfaces/payment/IVerifyPaymentUseCase";

export class PaymentController {
  constructor(
    private createOrderUseCase: ICreatePaymentUseCase,
    private verifyPaymentUseCase: IVerifyPaymentUseCase
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
}