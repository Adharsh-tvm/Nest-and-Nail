"use server";

import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";

export async function handleGoogleLogin(
  accessToken: string, 
  role?: string,
  mode: "signup" | "login" = "signup"
) {
  const res = await axiosInstance.post("/api/auth/google", {
    accessToken,
    role,
    mode,
  });

  const { accessToken: jwtAccess, refreshToken, user } = res.data;

  if (!jwtAccess || !refreshToken) {
    throw new Error("Failed to receive tokens from Google authentication");
  }

  const cookieStore = await cookies();

  // Save JWT access token
  cookieStore.set("accessToken", jwtAccess, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60, // 15 minutes
    path: "/",
  });

  // Save refresh token
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  // Store role
  cookieStore.set("userRole", user.role.toLowerCase(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  return user;
}