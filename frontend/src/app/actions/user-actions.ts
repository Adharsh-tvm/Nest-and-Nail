// app/actions/get-current-user.ts
"use server";
import { cookies } from "next/headers";
import userApi from "@/services/auth/user.api";
import "server-only";

type CanonicalUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean | string | number | undefined;
  [k: string]: any;
};

export async function getCurrentUser(): Promise<CanonicalUser | null> {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get("user_email")?.value;

    console.log("[getCurrentUser] All cookies:", cookieStore.getAll());
    console.log("[getCurrentUser] Email from cookie:", email);

    if (!email) {
      console.log("[getCurrentUser] No email found in cookies");
      return null;
    }

    console.log("[getCurrentUser] Fetching user with email:", email);
    const data = await userApi.getCurrentUserByEmail(email);
    console.log("[getCurrentUser] raw data:", data);

    // Normalize / map to canonical shape
    const rawUser = data?.user ?? data; // adapt if api returns { user: {...} } or {...}
    if (!rawUser) return null;

    const mapped = {
      id: rawUser.id ?? rawUser.user_id ?? rawUser.userId,
      name: rawUser.name ?? rawUser.user_name ?? rawUser.userName ?? "",
      email: rawUser.email ?? rawUser.email_address ?? "",
      role: rawUser.role ?? rawUser.user_role ?? "client",
      isVerified: rawUser.isVerified ?? rawUser.is_verified ?? rawUser.verified ?? false,
      // keep any extra fields
      ...rawUser,
    };

    console.log("[getCurrentUser] mapped user:", mapped);
    return mapped;
  } catch (err) {
    console.error("[getCurrentUser] Failed to fetch current user:", err);
    return null;
  }
}
