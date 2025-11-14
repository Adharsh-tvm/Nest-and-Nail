import mongoose from "mongoose";
import { Worker } from "../../../domain/entities/Worker";
import { UserModel } from "./UserModel";

const workerSchema = new mongoose.Schema<Worker>({
    skills: [{ type: String }]
});

export const WorkerModel = UserModel.discriminator<Worker>('worker', workerSchema);