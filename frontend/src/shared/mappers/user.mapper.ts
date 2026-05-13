import { VerificationStatus } from "@/shared/enums/authEnums";
import { User } from "@/shared/types/userTypes";
import { Address } from "@/shared/types/addressType";

export interface RawUserApiData {
  user_id?: string;
  user_name?: string;
  email_address?: string;
  user_role?: string;
  phone_number?: string | number | null;
  profileImageUrl?: string | null;
  profilePictureUrl?: string | null;
  profilePicture?: string | null;
  profile_image_url?: string | null;
  profile_picture?: string | null;
  isBlocked?: boolean;
  isOnline?: boolean;
  isVerified?: string;
  skills?: string[];
  address?: unknown[];
  documents?: unknown[];
  certificates?: unknown[];
  categories?: unknown[];
  workPhotos?: unknown[];
  createdAt?: string;
  updatedAt?: string;
  rating?: number;
  totalRatings?: number;
  weeklyJobCount?: number;
  currentActiveRequestId?: string | null;
}

export function mapUserFromApi(raw: RawUserApiData): User {
  return {
    id: raw.user_id || "",
    name: raw.user_name || "",
    email: raw.email_address || "",
    role: raw.user_role || "",

    phone_number: raw.phone_number ? Number(raw.phone_number) : undefined,
    profileImageUrl: raw.profileImageUrl || raw.profilePictureUrl || raw.profilePicture || raw.profile_image_url || raw.profile_picture || null,

    isBlocked: Boolean(raw.isBlocked),
    isOnline: Boolean(raw.isOnline),
    isVerified:
      raw.isVerified === "VERIFIED"
        ? VerificationStatus.VERIFIED
        : raw.isVerified === "PENDING"
          ? VerificationStatus.PENDING
          : VerificationStatus.NOT_VERIFIED,

    skills: Array.isArray(raw.skills) ? raw.skills : [],
    address: Array.isArray(raw.address) ? (raw.address as Address[]) : [],
    documents: Array.isArray(raw.documents) ? (raw.documents as string[]) : [],
    certificates: Array.isArray(raw.certificates) ? (raw.certificates as string[]) : [],
    categories: Array.isArray(raw.categories) ? (raw.categories as string[]) : [],
    workPhotos: Array.isArray(raw.workPhotos) ? (raw.workPhotos as string[]) : [],

    createdAt: raw.createdAt || undefined,
    updatedAt: raw.updatedAt || undefined,

    rating: raw.rating ?? 0,
    totalRatings: raw.totalRatings ?? 0,
    weeklyJobCount: raw.weeklyJobCount ?? 0,
    currentActiveRequestId: raw.currentActiveRequestId || undefined,
  };
}
