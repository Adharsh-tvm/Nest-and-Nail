import mongoose, { Schema, Document } from "mongoose";
import { SlotType } from "../../../shared/enums/slotEnums";

export interface IWorkerScheduleDocument extends Document {
  workerId: string;
  date: Date;
  slotType: SlotType;
  isBooked: boolean;
  serviceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkerScheduleSchema = new Schema<IWorkerScheduleDocument>(
  {
    workerId: { type: String, required: true },
    date: { type: Date, required: true },
    slotType: {
      type: String,
      enum: Object.values(SlotType),
      required: true,
    },
    isBooked: { type: Boolean, default: false },
    serviceId: { type: String },
  },
  { timestamps: true }
);

WorkerScheduleSchema.index({ workerId: 1, date: 1, slotType: 1 }, { unique: true });

export const WorkerScheduleModel = mongoose.model<IWorkerScheduleDocument>(
  "WorkerSchedule",
  WorkerScheduleSchema
);
