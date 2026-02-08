import { VerificationStatus } from "../enums/authEnums";
import { Address } from "./addressType";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  isVerified: VerificationStatus;
  isOnline: boolean;
  profileImageUrl?: string | null;

  phone_number?: number;
  skills?: string[];
  address?: Address[];
  documents?: string[];
  certificates?: string[];
  categories: string[];
  workPhotos?: string[];
  createdAt?: string;
  updatedAt?: string;

  iat?: number;
  exp?: number;
};

export type UserQueryParams = {
  isBlocked?: boolean;
  isVerified?: VerificationStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type PaginatedUserResponse = {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};