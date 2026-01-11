"use server"

import axiosInstance from "@/lib/axiosInstance";
import authApi from "@/services/api/auth.api";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function verifyAccessToken(token: string) {
  try {
    const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET);
    const verified = await jwtVerify(token, key);
    return verified.payload;
  } catch (error) {
    return null;
  }
}
export async function verifyRefreshToken(token: string) {
  try {
    const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET);
    const verified = await jwtVerify(token, key);
    return verified.payload;
  } catch (error) {
    return null;
  }
}


export async function refreshTokens(refreshToken: string): Promise<boolean> {
  try {
    const res = await authApi.refresh(refreshToken);

    // Axios response
    const data = res.data;

    if (!data.success) {
      return false;
    }

    const { accessToken, refreshToken: newRefreshToken } = data.payload;

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    cookieStore.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return true;
  } catch (error) {
    return false;
  }
}

