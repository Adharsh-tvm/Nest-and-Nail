import { IPaymentRepository } from "../../domain/repositories/IPaymentRepository";
import { Payment } from "../../domain/entities/Payment";
import { PaymentDocument } from "../database/models/PaymentModel";
import { Model } from "mongoose";

export class PaymentRepository implements IPaymentRepository {

  constructor(private model: Model<PaymentDocument>) {}

  async create(payment: Payment): Promise<Payment> {
    const created = await this.model.create({
      ...payment,
    });

    return {
      id: created._id.toString(),
      serviceId: created.serviceId,
      clientId: created.clientId,
      amount: created.amount,
      currency: created.currency,
      orderId: created.orderId,
      paymentId: created.paymentId,
      signature: created.signature,
      status: created.status,
      createdAt: created.createdAt
    };
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const doc = await this.model.findOne({ orderId }).lean();

    if (!doc) return null;

    return {
      id: doc._id.toString(),
      serviceId: doc.serviceId,
      clientId: doc.clientId,
      amount: doc.amount,
      currency: doc.currency,
      orderId: doc.orderId,
      paymentId: doc.paymentId,
      signature: doc.signature,
      status: doc.status,
      createdAt: doc.createdAt
    };
  }

  async updateByOrderId(orderId: string, update: Partial<Payment>): Promise<void> {
    await this.model.updateOne({ orderId }, update);
  }
}