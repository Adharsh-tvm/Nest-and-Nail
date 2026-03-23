import { Schema, model, Document } from "mongoose";

export interface IOtpDocument extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const OtpSchema = new Schema<IOtpDocument>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 120 });

export const OtpModel =
  model<IOtpDocument>("Otp", OtpSchema);