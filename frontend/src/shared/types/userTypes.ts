import { VerificationStatus } from "../enums/authEnums";
import { Address } from "./addressType";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: VerificationStatus;
  profileImageUrl?: string | null;

  phone_number?: number;
  skills?: string[];
  address?: Address[];
  documents?: string[];
  certificates?: string[];
  workPhotos?: string[];
  createdAt?: string;
  updatedAt?: string;

  iat?: number;
  exp?: number;
};

