// app/actions/get-current-user.ts
"use server";
import { cookies } from "next/headers";
import userApi from "@/services/api/user.api";
import { VerificationStatus } from "@/shared/enums/authEnums";
 

function normalizeVerification(value: any): VerificationStatus {
  if (value === true || value === 1 || value === "1" || value === "VERIFIED" || value === "verified") {
    return VerificationStatus.VERIFIED;
  }

  if (value === "PENDING" || value === "pending") {
    return VerificationStatus.PENDING;
  }

  return VerificationStatus.NOT_VERIFIED;
}

type CanonicalUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: VerificationStatus;
  profilePicture?: string | null;
  [k: string]: any;
};

export async function getCurrentUser(): Promise<CanonicalUser | null> {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get("user_email")?.value;

    if (!email) return null;

    const data = await userApi.getCurrentUserByEmail(email);
    const rawUser = data?.user ?? data;
    if (!rawUser) return null;

    console.log("data of current user",data)

    const mapped = {
      id: rawUser.id ?? rawUser.user_id ?? rawUser.userId,
      name: rawUser.name ?? rawUser.user_name ?? rawUser.userName ?? "",
      email: rawUser.email ?? rawUser.email_address ?? "",
      role: rawUser.role ?? rawUser.user_role ?? "client",

      isVerified: normalizeVerification(
        rawUser.isVerified ??
          rawUser.is_verified ??
          rawUser.verified ??
          false
      ),

      profileImageUrl:
        rawUser.profilePicture ??
        rawUser.profilePictureUrl ??
        rawUser.profileImageUrl ??
        rawUser.profile_picture ??
        rawUser.profile ??
        null,

      ...rawUser,
    };

    return mapped;
  } catch (err) {
    console.error("[getCurrentUser] Failed to fetch current user:", err);
    return null;
  }
}
