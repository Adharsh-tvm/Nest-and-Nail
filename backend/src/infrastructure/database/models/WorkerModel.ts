import { Schema } from "mongoose";
import { IUserDocument, UserModel } from "./UserModel";

export interface IWorkerDocument extends IUserDocument { }

const workerSchema = new Schema<IWorkerDocument>(
  {},
  { _id: false }
);

export const WorkerModel = UserModel.discriminator<IWorkerDocument>(
  "worker",
  workerSchema
);