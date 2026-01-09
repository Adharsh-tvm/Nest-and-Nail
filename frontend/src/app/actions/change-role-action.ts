"use server";

import { cookies } from "next/headers";
import userApi from "@/services/api/user.api";




export async function changeRoleAction(role: "client" | "worker") {
  try {
    // Call userApi - cookies are sent automatically via withCredentials
    const data = await userApi.updateUserMode(role);

    const { user, accessToken: newAccess, refreshToken: newRefresh } = data.payload;

    // Get cookie store
    const cookieStore = await cookies();

    const ACCESS_MAX_AGE = Number(process.env.MAX_AGE_ACCESS_TOKEN);
    const REFRESH_MAX_AGE = Number(process.env.MAX_AGE_REFRESH_TOKEN);

    // Update cookies if new tokens are provided
    if (newAccess) {
      cookieStore.set("accessToken", newAccess, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ACCESS_MAX_AGE, // 30 minutes
      });
    }

    if (newRefresh) {
      cookieStore.set("refreshToken", newRefresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: REFRESH_MAX_AGE, // 7 days
      });
    }

    return user;
  } catch (err) {
    console.error("Error switching role:", err);
    throw new Error("Failed to switch role");
  }
}