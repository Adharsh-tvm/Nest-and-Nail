"use server";

import { cookies } from "next/headers";
import userApi from "@/services/auth/user.api";
import "server-only";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const email = cookieStore.get("user_email")?.value;

    if (!token || !email) return null;

    const data = await userApi.getCurrentUserByEmail(email, token);

    return data?.user ?? null;
  } catch (err) {
    console.error("Failed to fetch current user:", err);
    return null;
  }
}
