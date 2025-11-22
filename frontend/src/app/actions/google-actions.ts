"use server";

import { cookies } from "next/headers";
import authApi from "@/services/auth/auth.api";

export async function handleGoogleLogin(
  accessToken: string, 
  role?: string,
  mode: "signup" | "login" = "signup"
) {
  const res = await authApi.googleAuth({
    accessToken,
    role
  })

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

  return user;
}