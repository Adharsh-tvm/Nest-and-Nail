import mongoose, { Model, Schema, Document } from "mongoose";

export interface IWalletTransactionDocument extends Document {
    transactionId: string;
    userId: string;
    amount: number;
    type: "CREDIT" | "DEBIT";
    description: string;
    createdAt: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransactionDocument>(
    {
        transactionId: { type: String, required: true, unique: true },
        userId: { type: String, required: true, index: true },
        amount: { type: Number, required: true },
        type: { type: String, enum: ["CREDIT", "DEBIT"], required: true },
        description: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export const WalletTransactionModel: Model<IWalletTransactionDocument> =
    mongoose.model<IWalletTransactionDocument>("WalletTransaction", WalletTransactionSchema);
