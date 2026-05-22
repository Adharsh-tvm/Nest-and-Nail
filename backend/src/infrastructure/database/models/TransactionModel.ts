import mongoose, { Schema, Document } from "mongoose";
import { transactionSource, transactionStatus, transactionType } from "../../../shared/enums/transactionEnums";

export interface ITransactionDocument extends Document {
  transactionId: string;
  walletId: string;
  userId: string;

  type: transactionType;
  amount: number;

  source: transactionSource;

  serviceId?: string;

  status: transactionStatus;

  createdAt: Date;
}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    transactionId: { type: String, required: true, unique: true },
    walletId: { type: String, required: true },
    userId: { type: String, required: true },

    type: { type: String, enum: transactionType, required: true },
    amount: { type: Number, required: true },

    source: {
      type: String,
      enum: transactionSource,
      required: true,
    },

    serviceId: { type: String },

    status: {
      type: String,
      enum: transactionStatus,
      default: transactionStatus.SUCCESS,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const TransactionModel = mongoose.model<ITransactionDocument>(
  "Transaction",
  TransactionSchema
);