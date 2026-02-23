import mongoose, { Document } from "mongoose";
import { ServiceRequestStatus } from "../../../shared/enums/serviceEnums";

export interface IServiceRequestDocument extends Document {
    requestId: string;
    clientId: string;
    title?: string;
    description?: string;
    category?: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    serviceDate: Date;
    budget?: number;
    servicePhotos: string[];
    status: ServiceRequestStatus;
    assignedTo?: string;
    triedWorkers: string[];
    reservedBy?: string;
    reservationExpiresAt?: Date;
    client: {
        name: string;
        email: string;
        phone?: number;
        profilePictureUrl?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ServiceRequestSchema = new mongoose.Schema<IServiceRequestDocument>(
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

        assignedTo: { type: String },
        triedWorkers: { type: [String], default: [] },

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

export const ServiceRequestModel = mongoose.model<IServiceRequestDocument>(
    "ServiceRequest",
    ServiceRequestSchema
)