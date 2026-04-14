import mongoose, { Model, Schema, Document } from "mongoose";

export interface IWalletDocument extends Document {
    walletId: string;
    userId: string;
    balance: number;
    currency: "INR";
    createdAt: Date;
    updatedAt: Date;
}

const WalletSchema = new Schema<IWalletDocument>(
    {
        walletId: { type: String, required: true, unique: true },
        userId: { type: String, required: true, unique: true, index: true },
        balance: { type: Number, required: true, default: 0 },
        currency: { type: String, enum: ["INR"], default: "INR" },
    },
    {
        timestamps: true,
    }
);

export const WalletModel: Model<IWalletDocument> =
    mongoose.model<IWalletDocument>("Wallet", WalletSchema);
