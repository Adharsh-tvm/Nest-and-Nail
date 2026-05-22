import mongoose from "mongoose";
import { UserModel, IUserDocument } from "./UserModel";

export type IAdminDocument = IUserDocument;

const adminSchema = new mongoose.Schema<IAdminDocument>(
    {},
    { _id: false }
);

export const AdminModel = UserModel.discriminator<IAdminDocument>("admin", adminSchema);
