"use server";

import { cookies } from "next/headers";
import userApi from "@/sources/api/user.api";
import { fetchAllCategories } from "@/sources/api/category.api";
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
    const { authApi } = await import("@/sources/api/auth.api");
    const res = await authApi.validate();
    return res.data;
  } catch {
    return null;
  }
}

export async function fetchOnlineWorkers(): Promise<User[]> {
  try {
    const data = await userApi.getOnlineWorkers();
    if (!data.success || !data.payload) return [];

    // Fetch categories to map IDs to names
    let categoryMap: Record<string, string> = {};
    try {
      const categories = await fetchAllCategories();
      categoryMap = categories.reduce((acc, cat) => {
        if (cat.id) acc[cat.id.toLowerCase()] = cat.name;
        // In case id is returned as `_id` instead
        if ((cat as any)._id) acc[(cat as any)._id.toLowerCase()] = cat.name;
        return acc;
      }, {} as Record<string, string>);
    } catch (e) {
      console.error("[fetchOnlineWorkers] Failed to fetch categories for mapping", e);
    }

    // Normalizing the response payload using similar logic as getCurrentUser if needed
    return data.payload.map((u: any) => ({
      id: u.userId, // Based on WorkerRepository response mapping
      name: u.name,
      email: u.email,
      role: u.role,
      isBlocked: Boolean(u.isBlocked),
      isOnline: Boolean(u.isOnline),
      isVerified: normalizeIsVerified(u.isVerified),
      profileImageUrl: u.profileImageUrl || u.profilePictureUrl || u.profilePicture || u.profile_image_url || u.profile_picture || null,
      phone_number: u.phone, // Or u.phone_number
      skills: u.skills ?? [],
      address: u.address ?? [],
      documents: u.documents ?? [],
      certificates: u.certificates ?? [],
      categories: (u.categories ?? []).map((catId: string) => categoryMap[catId.toLowerCase()] || catId),
      workPhotos: u.workPhotos ?? [],
      rating: u.rating ?? 0,
      totalRatings: u.totalRatings ?? 0,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    })) as User[];
  } catch (err) {
    console.error("[fetchOnlineWorkers] failed:", err);
    return [];
  }
}
