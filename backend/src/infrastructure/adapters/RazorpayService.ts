import Razorpay from "razorpay";

export class RazorpayService {
  private razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY!,
      key_secret: process.env.RAZORPAY_SECRET!
    });
  }

  async createOrder(amount: number) {
    return this.razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });
  }

  verifySignature(orderId: string, paymentId: string, signature: string) {
    const crypto = require("crypto");

    const body = orderId + "|" + paymentId;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body.toString())
      .digest("hex");

    return expected === signature;
  }
}