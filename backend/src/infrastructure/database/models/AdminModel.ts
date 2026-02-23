import mongoose, { Document } from "mongoose";
import { UserModel, IUserDocument } from "./UserModel";

export interface IAdminDocument extends IUserDocument { }

const adminSchema = new mongoose.Schema<IAdminDocument>(
    {},
    { _id: false }
);

export const AdminModel = UserModel.discriminator<IAdminDocument>("admin", adminSchema);
