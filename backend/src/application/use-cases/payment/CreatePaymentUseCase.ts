import { IPaymentGateway } from "../../../domain/gateways/IPaymentGateway";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { v4 as uuidv4 } from "uuid";
import { PaymentStatus } from "../../../shared/enums/paymentEnums";
import { ICreatePaymentUseCase } from "../../interfaces/payment/ICreatePaymentUseCase";

export class CreatePaymentUseCase implements ICreatePaymentUseCase {
  constructor(
    private paymentRepo: IPaymentRepository,
    private paymentGateway: IPaymentGateway,
    private serviceRepo: IServiceRepository
  ) { }

  async execute(serviceId: string, clientId: string) {
    const service = await this.serviceRepo.findById(serviceId);
    if (!service) {
      throw new Error("Service not found");
    }

    const amount = service.totalAmount;

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