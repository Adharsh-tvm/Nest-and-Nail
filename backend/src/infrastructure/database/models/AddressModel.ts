import mongoose from "mongoose";

export const AddressSchema = new mongoose.Schema(
    {
        addressId: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            enum: ["HOME", "WORK", "OTHER"],
            required: true,
        },
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String,

        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },

        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);