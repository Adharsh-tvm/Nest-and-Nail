import mongoose from "mongoose";
import { Admin } from "../../../domain/entities/Admin";
import { UserModel } from "./UserModel";

const adminSchema = new mongoose.Schema<Admin>({}, {});

export const AdminModel = UserModel.discriminator<Admin>("admin", adminSchema);
