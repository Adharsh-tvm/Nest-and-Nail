import { Schema } from "mongoose";
import { IUserDocument, UserModel } from "./UserModel";

export type IWorkerDocument = IUserDocument;

const workerSchema = new Schema<IWorkerDocument>(
  {},
  { _id: false }
);

export const WorkerModel = UserModel.discriminator<IWorkerDocument>(
  "worker",
  workerSchema
);