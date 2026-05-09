import Razorpay from "razorpay";
import crypto from "crypto";
import { env } from "../../config/env";

export class RazorpayService {
  private razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY,
      key_secret: env.RAZORPAY_SECRET
    });
  }

  async createOrder(amount: number) {
    return this.razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${String(Date.now())}`
    });
  }

  verifySignature(orderId: string, paymentId: string, signature: string) {
    const body = `${orderId}|${paymentId}`;

    const expected = crypto
      .createHmac("sha256", env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    return expected === signature;
  }
}