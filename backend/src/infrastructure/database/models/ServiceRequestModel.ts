import mongoose from "mongoose";
import { ServiceRequestStatus } from "../../../shared/enums/serviceEnums";

const ServiceRequestSchema = new mongoose.Schema(
    {
        requestId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        clientId: { type: String, required: true },

        title: String,
        description: String,
        category: String,

        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },

        serviceDate: {
            type: Date,
            required: true
        },

        budget: Number,

        servicePhotos: {
            type: [String],
            default: []
        },

        status: {
            type: String,
            enum: Object.values(ServiceRequestStatus),
            default: ServiceRequestStatus.OPEN
        },

        reservedBy: { type: String },
        reservationExpiresAt: { type: Date },

        client: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: Number },
            profilePictureUrl: { type: String }
        }
    },
    { timestamps: true }
);

ServiceRequestSchema.index({ location: "2dsphere" });

export const ServiceRequestModel = mongoose.model(
    "ServiceRequest",
    ServiceRequestSchema
)