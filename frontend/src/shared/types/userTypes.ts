import { VerificationStatus } from "../enums/authEnums";
import { Address } from "./addressType";
import { Review } from "./reviewTypes";

export type User = {
  id: string;
  userId?: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  isVerified: VerificationStatus;
  isOnline: boolean;
  profileImageUrl?: string | null;
  profilePictureUrl?: string | null;

  phone_number?: number;
  skills?: string[];
  address?: Address[];
  documents?: string[];
  certificates?: string[];
  excludedServices?: string[];
  categories: string[];
  workPhotos?: string[];
  createdAt?: string;
  updatedAt?: string;

  rating?: number;
  totalRatings?: number;
  weeklyJobCount?: number;
  currentActiveRequestId?: string;
  isSuspended?: boolean;
  suspensionStartDate?: string;
  suspensionEndDate?: string;
  canAcceptBookings?: boolean;

  iat?: number;
  exp?: number;
  distance?: number;
  reviews?: Review[];
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

export type Wallet = {
  walletId: string;
  userId: string;
  balance: number;
  currency: "INR";
  createdAt?: string;
  updatedAt?: string;
};