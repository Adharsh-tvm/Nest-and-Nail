import { VerificationStatus } from "@/shared/enums/authEnums";
import { User } from "@/shared/types/userTypes";

export function mapUserFromApi(raw: any): User {
  return {
    id: raw.user_id,
    name: raw.user_name,
    email: raw.email_address,
    role: raw.user_role,

    phone_number: raw.phone_number ?? null,
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
    address: Array.isArray(raw.address) ? raw.address : [],
    documents: Array.isArray(raw.documents) ? raw.documents : [],
    certificates: Array.isArray(raw.certificates) ? raw.certificates : [],
    workPhotos: Array.isArray(raw.workPhotos) ? raw.workPhotos : [],

    createdAt: raw.createdAt || undefined,
    updatedAt: raw.updatedAt || undefined,
  };
}
