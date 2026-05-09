import { Schema } from "mongoose";

export interface IAddressDocument {
  addressId: string;
  label: "HOME" | "WORK" | "OTHER";

  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;

  location: {
    type: "Point";
    coordinates: [number, number];
  };

  isDefault?: boolean;
}

export const AddressSchema = new Schema<IAddressDocument>(
  {
    addressId: { type: String, required: true },

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