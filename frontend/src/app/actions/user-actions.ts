// app/actions/get-current-user.ts (or wherever your server action is)
"use server";
import { cookies } from "next/headers";
import userApi from "@/services/auth/user.api";
import "server-only";

export async function getCurrentUser() {
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
    
    console.log("[getCurrentUser] User data received:", data);
    return data?.user ?? null;
  } catch (err) {
    console.error("[getCurrentUser] Failed to fetch current user:", err);
    return null;
  }
}