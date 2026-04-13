import Razorpay from "razorpay";
import crypto from "crypto";
import { IPaymentGateway } from "../../domain/gateways/IPaymentGateway";

export class RazorpayGateway implements IPaymentGateway {

  private razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY!,
      key_secret: process.env.RAZORPAY_SECRET!
    });
  }

  async createOrder(amount: number) {
    const order = await this.razorpay.orders.create({
      amount: amount * 100,
      currency: "INR"
    });

    return {
      orderId: order.id,
      amount: Number(order.amount),
      currency: order.currency
    };
  }

  verifyPayment({ orderId, paymentId, signature }: any): boolean {
    const body = orderId + "|" + paymentId;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest("hex");

    console.log("=== Signature Verification ===");
    console.log("Order ID:", orderId);
    console.log("Payment ID:", paymentId);
    console.log("Provided:", signature);
    console.log("Expected:", expected);

    return expected === signature;
  }
}