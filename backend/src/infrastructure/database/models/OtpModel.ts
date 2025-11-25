import { Schema, model } from "mongoose";

const OtpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 120 }  // Auto-delete after 120 seconds (2 minutes)
  }
});

export const OtpModel = model("Otp", OtpSchema);
