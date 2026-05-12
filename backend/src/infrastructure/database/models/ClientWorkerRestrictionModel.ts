import mongoose, { Schema, Document } from "mongoose";

export interface IClientWorkerRestrictionDocument extends Document {
  restrictionId: string;
  clientId: string;
  workerId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ClientWorkerRestrictionSchema = new Schema<IClientWorkerRestrictionDocument>(
  {
    restrictionId: { type: String, required: true, unique: true },
    clientId: { type: String, required: true },
    workerId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

ClientWorkerRestrictionSchema.index({ clientId: 1, workerId: 1 });
ClientWorkerRestrictionSchema.index({ expiresAt: 1 });

export const ClientWorkerRestrictionModel = mongoose.model<IClientWorkerRestrictionDocument>(
  "ClientWorkerRestriction",
  ClientWorkerRestrictionSchema
);
