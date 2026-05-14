"use server";

import { cookies } from "next/headers";
import userApi from "@/sources/api/user/user.api";
import { VerificationStatus } from "@/shared/enums/authEnums";
import { ApiResponse } from "@/shared/types/responseTypes";
import { User } from "@/shared/types/userTypes";
import { Address } from "@/shared/types/addressType";
import axios from "axios";

function normalizeIsVerified(v: unknown): VerificationStatus {
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
    let email = cookieStore.get("user_email")?.value;

    if (!email) {
      const accessToken = cookieStore.get("accessToken")?.value;
      if (accessToken) {
        const { verifyAccessToken } = await import("../authentication/session-actions");
        const payload = await verifyAccessToken(accessToken);
        email = payload?.email;
      }
    }

    if (!email) return null;

    const data = (await userApi.getCurrentUserByEmail(email)) as ApiResponse<Record<string, unknown>>;
    if (!data.success || !data.payload) return null;

    const u = data.payload;

    const user: User = {
      id: String(u.user_id || ""),
      name: String(u.user_name || ""),
      email: String(u.email_address || ""),
      role: String(u.user_role || ""),
      isBlocked: Boolean(u.isBlocked),
      isOnline: Boolean(u.isOnline),
      isVerified: normalizeIsVerified(u.isVerified),

      profileImageUrl: (u.profileImageUrl || u.profilePictureUrl || u.profilePicture || u.profile_image_url || u.profile_picture || null) as string | null,
      phone_number: typeof u.phone_number === "number" ? u.phone_number : (u.phone_number ? Number(u.phone_number) : undefined),
      skills: (u.skills ?? []) as string[],
      address: (u.address ?? []) as Address[],
      documents: (u.documents ?? []) as string[],
      certificates: (u.certificates ?? []) as string[],
      categories: (u.categories ?? []) as string[],
      workPhotos: (u.workPhotos ?? []) as string[],

      createdAt: u.createdAt ? String(u.createdAt) : undefined,
      updatedAt: u.updatedAt ? String(u.updatedAt) : undefined,
    };

    return user;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        return null;
      }
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


