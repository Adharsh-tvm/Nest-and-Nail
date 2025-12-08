// app/actions/get-current-user.ts (server)
"use server";
import { cookies } from "next/headers";
import userApi from "@/services/api/user.api";
import "server-only";

type CanonicalUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean | string | number | undefined;
  profilePicture?: string | null;
  [k: string]: any;
};

export async function getCurrentUser(): Promise<CanonicalUser | null> {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get("user_email")?.value;

    if (!email) return null;

    const data = await userApi.getCurrentUserByEmail(email);

    console.log("uuuuuuuuuuuuuuuuuuuuuseeeeeeeeeeeeeeeeeeeeeeerrrrrrrrrrrrrrrrrrrrrr", data.user)
    const rawUser = data?.user ?? data;
    if (!rawUser) return null;

    const mapped = {
      id: rawUser.id ?? rawUser.user_id ?? rawUser.userId,
      name: rawUser.name ?? rawUser.user_name ?? rawUser.userName ?? "",
      email: rawUser.email ?? rawUser.email_address ?? "",
      role: rawUser.role ?? rawUser.user_role ?? "client",
      isVerified: rawUser.isVerified ?? rawUser.is_verified ?? rawUser.verified ?? false,
      profileImageUrl:
        rawUser.profilePicture ??
        rawUser.profilePictureUrl ??
        rawUser.profileImageUrl ??
        rawUser.profile_picture ??
        rawUser.profile ?? null,
      // keep the rest
      ...rawUser,
    };

    return mapped;
  } catch (err) {
    console.error("[getCurrentUser] Failed to fetch current user:", err);
    return null;
  }
}
