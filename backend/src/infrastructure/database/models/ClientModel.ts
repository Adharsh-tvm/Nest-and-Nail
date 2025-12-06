import mongoose from "mongoose";
import { Client } from "../../../domain/entities/Client";
import { UserModel } from "./UserModel";

const clientSchema = new mongoose.Schema<Client>({
  address: String,
});


export const ClientModel = UserModel.discriminator<Client>('client', clientSchema);
