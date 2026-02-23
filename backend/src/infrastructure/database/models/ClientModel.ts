import { Schema } from "mongoose";
import { IUserDocument, UserModel } from "./UserModel";

export interface IClientDocument extends IUserDocument {}

const clientSchema = new Schema<IClientDocument>(
  {},
  { _id: false }
);

export const ClientModel =
  UserModel.discriminator<IClientDocument>(
    "client",
    clientSchema
  );