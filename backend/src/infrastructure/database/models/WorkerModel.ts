import mongoose from "mongoose";
import { Worker } from "../../../domain/entities/Worker";
import { UserModel } from "./UserModel";

const workerSchema = new mongoose.Schema<Worker>({
  // additional worker-only fields (if any)
});

export const WorkerModel = UserModel.discriminator<Worker>('worker', workerSchema);
