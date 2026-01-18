"use server";

import { cookies } from "next/headers";
import userApi from "@/services/api/user.api";
import { VerificationStatus } from "@/shared/enums/authEnums";
import { ApiResponse } from "@/shared/types/responseTypes";
import { User } from "@/shared/types/userTypes";

function normalizeIsVerified(v: any): VerificationStatus {
  if (v === true || v === "VERIFIED" || v === "verified") {
    return VerificationStatus.VERIFIED;
  }
  if (v === "PENDING" || v === "pending") {
    return VerificationStatus.PENDING;
  }
  return VerificationStatus.NOT_VERIFIED;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get("user_email")?.value;
    if (!email) return null;

    const data = (await userApi.getCurrentUserByEmail(email)) as ApiResponse<any>;
    if (!data.success || !data.payload) return null;

    const u = data.payload;

    const user: User = {
      id: u.user_id,
      name: u.user_name,
      email: u.email_address,
      role: u.user_role,
      isBlocked: Boolean(u.isBlocked),
      isOnline: Boolean(u.isOnline),
      isVerified: normalizeIsVerified(u.isVerified),

      profileImageUrl: u.profilePictureUrl ?? null,
      phone_number: u.phone_number,
      skills: u.skills ?? [],
      address: u.address ?? [],
      documents: u.documents ?? [],
      certificates: u.certificates ?? [],
      workPhotos: u.workPhotos ?? [],

      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };

    return user;
  } catch (err) {
    console.error("[getCurrentUser] failed:", err);
    return null;
  }
}
