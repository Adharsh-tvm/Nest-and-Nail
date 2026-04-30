import mongoose, { Schema, Document } from "mongoose";

export interface ReviewDocument extends Document {
  reviewId: string;
  serviceId: string;
  clientId: string;
  workerId: string;
  rating: number;
  review?: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<ReviewDocument>({
  reviewId: { type: String, required: true },
  serviceId: { type: String, required: true, unique: true }, 

  clientId: { type: String, required: true },
  workerId: { type: String, required: true },

  rating: { type: Number, required: true },
  review: { type: String },

  createdAt: { type: Date, default: Date.now }
});

export const ReviewModel = mongoose.model<ReviewDocument>("Review", ReviewSchema);