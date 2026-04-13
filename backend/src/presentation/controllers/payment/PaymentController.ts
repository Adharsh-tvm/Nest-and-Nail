import { Request, Response } from "express";
import { ICreatePaymentUseCase } from "../../../application/interfaces/payment/ICreatePaymentUseCase";
import { IVerifyPaymentUseCase } from "../../../application/interfaces/payment/IVerifyPaymentUseCase";

export class PaymentController {
  constructor(
    private createOrderUseCase: ICreatePaymentUseCase,
    private verifyPaymentUseCase: IVerifyPaymentUseCase
  ) {}

  createOrder = async (req: Request, res: Response) => {
    const { serviceId, amount } = req.body;
    const clientId = req.user.id;

    const order = await this.createOrderUseCase.execute(
      serviceId,
      clientId,
      amount
    );

    res.json(order);
  };

  verify = async (req : Request, res: Response) => {
    const result = await this.verifyPaymentUseCase.execute(req.body);

    res.json(result);
  };
}