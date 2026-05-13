import mongoose from "mongoose";
import { PaymentModel } from "./src/infrastructure/database/models/PaymentModel";
import { TransactionModel } from "./src/infrastructure/database/models/TransactionModel";
import { WalletModel } from "./src/infrastructure/database/models/WalletModel";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

async function migrate() {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nest_and_nail");
    
    console.log("Connected to DB");
    
    const payments = await PaymentModel.find({ status: "SUCCESS" });
    console.log(`Found ${payments.length} successful payments`);
    
    let added = 0;
    
    for (const payment of payments) {
        // check if transaction already exists for this payment by client
        const existingTx = await TransactionModel.findOne({
            userId: payment.clientId,
            serviceId: payment.serviceId,
            source: "RAZORPAY",
            type: "DEBIT"
        });
        
        if (!existingTx) {
            let clientWallet = await WalletModel.findOne({ userId: payment.clientId });
            if (!clientWallet) {
                clientWallet = await WalletModel.create({
                    walletId: uuidv4(),
                    userId: payment.clientId,
                    balance: 0,
                    currency: "INR"
                });
            }
            
            await TransactionModel.create({
                transactionId: uuidv4(),
                walletId: clientWallet.walletId,
                userId: payment.clientId,
                type: "DEBIT",
                amount: payment.amount,
                source: "RAZORPAY",
                serviceId: payment.serviceId,
                status: "SUCCESS",
                createdAt: payment.createdAt
            });
            
            added++;
        }
    }
    
    console.log(`Migrated ${added} payments to client transactions`);
    await mongoose.disconnect();
}

migrate().catch(console.error);
