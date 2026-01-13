import { VerificationStatus } from "@/shared/enums/authEnums";
import { User } from "@/shared/types/userTypes";

export function mapUserFromApi(raw: any): User {
  return {
    id: raw.user_id,
    name: raw.user_name,
    email: raw.email_address,
    role: raw.user_role,
    phone_number: raw.phone_number ?? null,
    profileImageUrl: raw.profileImageUrl || null,
    isBlocked: Boolean(raw.isBlocked),
    isVerified:
      raw.isVerified === "VERIFIED"
        ? VerificationStatus.VERIFIED
        : raw.isVerified === "PENDING"
        ? VerificationStatus.PENDING
        : VerificationStatus.NOT_VERIFIED,
  };
}
