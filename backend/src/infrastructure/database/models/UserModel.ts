import mongoose, { Model, Schema } from "mongoose";
import { User } from "../../../domain/entities/User";
import { LoginMethod, Role, VerificationStatus } from "../../../shared/enums/authEnums";
import { AddressSchema } from "./AddressModel";



const UserSchema = new Schema<User>({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number },

    passwordhash: { type: String, default: null },

    isBlocked: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    isVerified: {
        type: String,
        enum: Object.values(VerificationStatus),
        default: VerificationStatus.NOT_VERIFIED
    },

    profilePictureUrl: { type: String, default: "" },

    role: {
        type: String,
        enum: Object.values(Role),
        required: true
    },

    loginMethod: {
        type: String,
        enum: Object.values(LoginMethod),
        default: LoginMethod.EMAIL_PASSWORD
    },

    skills: { type: [String], default: [] },
    address: { type: [AddressSchema], default: [] },

    lastLoginAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    documents: [String],
    certificates: [String],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: []
    }],

    workPhotos: [String],

    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    weeklyJobCount: { type: Number, default: 0 },
    currentActiveRequestId: { type: String, default: null },
}, {
    timestamps: true,
    discriminatorKey: 'role'
});

UserSchema.index({ "address.location": "2dsphere" });

export const UserModel: Model<User> = mongoose.model<User>('User', UserSchema);