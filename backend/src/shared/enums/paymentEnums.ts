export enum PaymentStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  RAZORPAY = "RAZORPAY",
  CASH = "CASH",
  WALLET = "WALLET"
}