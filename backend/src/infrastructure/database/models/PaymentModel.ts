// infrastructure/database/models/PaymentModel.ts

import { Schema, model, Model, Types } from "mongoose";
import { PaymentStatus } from "../../../shared/enums/paymentEnums";

export interface PaymentDocument {
  _id: Types.ObjectId;

  serviceId: string;
  clientId: string;

  amount: number;
  currency: string;

  orderId: string;
  paymentId?: string;
  signature?: string;

  status: PaymentStatus;

  createdAt: Date;
}

const PaymentSchema = new Schema<PaymentDocument>({
  serviceId: { type: String, required: true },
  clientId: { type: String, required: true },

  amount: { type: Number, required: true },
  currency: { type: String, required: true },

  orderId: { type: String, required: true },
  paymentId: { type: String },
  signature: { type: String },

  status: {
    type: String,
    enum: ["CREATED", "SUCCESS", "FAILED"],
    required: true
  },

  createdAt: { type: Date, default: Date.now }
});

export const PaymentModel: Model<PaymentDocument> =
  model<PaymentDocument>("Payment", PaymentSchema);