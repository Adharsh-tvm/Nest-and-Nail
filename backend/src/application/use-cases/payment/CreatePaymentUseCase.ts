import { IPaymentGateway } from "../../../domain/gateways/IPaymentGateway";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { v4 as uuidv4 } from "uuid";
import { PaymentStatus } from "../../../shared/enums/paymentEnums";
import { ICreatePaymentUseCase } from "../../interfaces/payment/ICreatePaymentUseCase";

export class CreatePaymentUseCase implements ICreatePaymentUseCase {
  constructor(
    private paymentRepo: IPaymentRepository,
    private paymentGateway: IPaymentGateway
  ) { }

  async execute(serviceId: string, clientId: string, amount: number) {

    const order = await this.paymentGateway.createOrder(amount);

    await this.paymentRepo.create({
      id: uuidv4(),
      serviceId,
      clientId,
      amount,
      currency: order.currency,
      orderId: order.orderId,
      status: PaymentStatus.CREATED,
      createdAt: new Date()
    });

    return order;
  }
}