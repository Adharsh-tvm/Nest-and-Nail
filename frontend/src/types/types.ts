import { VerificationStatus } from "@/shared/enums/authEnums";

export type PendingVerificationUser = {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  isVerified: "NOT_VERIFIED" | "PENDING" | "VERIFIED"; 
  profilePictureUrl?: string;
  skills: string[];
  address?: string;
  phone?: string;
  documents: string[];
  certificates: string[];
  workPhotos: string[];
  createdAt: string;  
  updatedAt: string;
};

export interface WorkerUser {
  id: string;
  name: string;
  email: string;
  role: string;

  isVerified: VerificationStatus

  profileImageUrl?: string | null;
  phone_number?: string;
  address?: string;
  createdAt?: string;

  skills?: string[];
  workPhotos?: string[];
  certificates?: string[];
  documents?: string[];
}
