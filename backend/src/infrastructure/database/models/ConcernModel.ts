import mongoose, { Schema, Document } from "mongoose";
import { concernBy, concernStatus } from "../../../shared/enums/concernEnums";

export interface ConcernDocument extends Document {
  concernId: string;
  serviceId: string;
  userId: string;
  raisedBy: concernBy;
  message: string;
  status: concernStatus;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  images?: string[];
}

const ConcernSchema = new Schema<ConcernDocument>(
  {
    concernId: {
      type: String,
      required: true,
      unique: true
    },

    serviceId: {
      type: String,
      required: true,
      index: true
    },

    userId: {
      type: String,
      required: true,
      index: true
    },

    raisedBy: {
      type: String,
      enum: concernBy,
      required: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: concernStatus,
      default: concernStatus.OPEN,
      index: true
    },

    resolvedAt: {
      type: Date
    },

    resolvedBy: {
      type: String
    },

    images: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true 
  }
);

export const ConcernModel = mongoose.model<ConcernDocument>(
  "Concern",
  ConcernSchema
);