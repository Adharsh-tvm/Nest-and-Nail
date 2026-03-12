import mongoose, { Model, Schema, Document } from "mongoose";
import { AddressSchema, IAddressDocument } from "./AddressModel";

export interface IUserDocument extends Document {
    userId: string;
    name: string;
    email: string;
    phone?: number;
    passwordhash?: string | null;
    isBlocked: boolean;
    isOnline: boolean;
    isVerified: string;
    profilePictureUrl: string;
    role: string;
    loginMethod: string;
    skills: string[];
    address: IAddressDocument[];
    lastLoginAt: Date;
    documents?: string[];
    certificates?: string[];
    categories?: mongoose.Types.ObjectId[];
    workPhotos?: string[];
    rating: number;
    totalRatings: number;
    isAvailable: boolean;
    weeklyJobCount: number;
    currentActiveRequestId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
    {
        userId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },

        phone: Number,
        passwordhash: { type: String, default: null },

        isBlocked: { type: Boolean, default: false },
        isOnline: { type: Boolean, default: false },

        isVerified: { type: String, default: "NOT_VERIFIED" },
        role: { type: String, required: true },
        loginMethod: { type: String, default: "EMAIL_PASSWORD" },

        profilePictureUrl: { type: String, default: "" },

        skills: { type: [String], default: [] },
        address: { type: [AddressSchema], default: [] },

        lastLoginAt: { type: Date, default: Date.now },

        documents: [String],
        certificates: [String],

        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }],

        workPhotos: [String],

        rating: { type: Number, default: 0 },
        totalRatings: { type: Number, default: 0 },

        isAvailable: { type: Boolean, default: true },
        weeklyJobCount: { type: Number, default: 0 },

        currentActiveRequestId: { type: String, default: null }
    },
    {
        timestamps: true,
        discriminatorKey: "role"
    }
);

UserSchema.index({ "address.location": "2dsphere" });

export const UserModel: Model<IUserDocument> =
    mongoose.model<IUserDocument>("User", UserSchema);