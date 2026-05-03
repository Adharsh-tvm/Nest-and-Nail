"use server";

import { cookies } from "next/headers";
import userApi from "@/sources/api/user/user.api";
import { fetchAllCategories } from "@/sources/api/category/category.api";
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

      profileImageUrl: u.profileImageUrl || u.profilePictureUrl || u.profilePicture || u.profile_image_url || u.profile_picture || null,
      phone_number: u.phone_number,
      skills: u.skills ?? [],
      address: u.address ?? [],
      documents: u.documents ?? [],
      certificates: u.certificates ?? [],
      categories: u.categories ?? [],
      workPhotos: u.workPhotos ?? [],

      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };

    return user;
  } catch (err: any) {
    // If 401/403, just return null (user not logged in or session expired)
    // Don't log to console to avoid noise
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      return null;
    }

    console.error("[getCurrentUser] failed:", err);
    return null;
  }
}

export async function validateUser() {
  try {
    const { authApi } = await import("@/sources/api/user/auth.api");
    const res = await authApi.validate();
    return res.data;
  } catch {
    return null;
  }
}


