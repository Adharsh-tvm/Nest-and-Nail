import mongoose, { Schema, Document } from "mongoose";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";
import { PaymentStatus } from "../../../shared/enums/paymentStatus";

import { SlotType } from "../../../shared/enums/slotEnums";

export interface IServiceDocument extends Document {
  serviceId: string;

  clientId: string;
  workerId: string;

  category: string;

  title: string;
  description: string;

  location: {
    type: string;
    coordinates: [number, number];
  };

  scheduledDate: Date;
  selectedSlots: {
    date: Date;
    slotType: SlotType;
  }[];

  numberOfDays: number;

  advanceAmount?: number;

  totalAmount?: number;

  bufferDay?: boolean;

  agreedBudget?: number;

  status: ServiceStatus;

  paymentStatus: PaymentStatus;

  startedAt?: Date;
  completedAt?: Date;

  cancelledAt?: Date;
  cancellationReason?: string;

  rating?: number;
  review?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IServiceDocument>(
  {
    serviceId: { type: String, required: true, unique: true },

    clientId: { type: String, required: true },
    workerId: { type: String, required: true },

    category: { type: String, required: true },

    title: { type: String, required: true },
    description: { type: String, required: true },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    scheduledDate: { type: Date, required: true },
    selectedSlots: {
      type: [{
        date: { type: Date, required: true },
        slotType: { type: String, enum: Object.values(SlotType), required: true }
      }],
      required: true,
      default: []
    },

    numberOfDays: {
      type: Number,
      default: 1,
    },

    advanceAmount: {
      type: Number,
    },

    totalAmount: {
      type: Number,
    },

    bufferDay: {
      type: Boolean,
      default: false,
    },

    agreedBudget: {
      type: Number,
    },

    status: {
      type: String,
      enum: Object.values(ServiceStatus),
      default: ServiceStatus.CONFIRMED,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    startedAt: Date,
    completedAt: Date,

    cancelledAt: Date,
    cancellationReason: String,

    rating: Number,
    review: String,
  },
  { timestamps: true }
);

ServiceSchema.index({ location: "2dsphere" });

ServiceSchema.index({ workerId: 1, scheduledDate: 1 });
ServiceSchema.index({ clientId: 1 });

export const ServiceModel = mongoose.model<IServiceDocument>(
  "Service",
  ServiceSchema
);