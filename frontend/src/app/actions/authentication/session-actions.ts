"use server"

import authApi from "@/sources/api/user/auth.api";
import { JwtPayload } from "@/shared/types/JwtPayload";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function verifyAccessToken(
  token: string
): Promise<JwtPayload | null> {
  try {
    const key = new TextEncoder().encode(
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET
    );

    const { payload } = await jwtVerify(token, key);

    if (
      typeof payload === "object" &&
      payload !== null &&
      "id" in payload &&
      "email" in payload &&
      "role" in payload
    ) {
      return payload as JwtPayload;
    }

    return null;
  } catch {
    return null;
  }
}
export async function verifyRefreshToken(token: string) {
  try {
    const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET);
    const verified = await jwtVerify(token, key);
    return verified.payload;
  } catch {
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

    // Verify the new token to get user info for other cookies
    const payload = await verifyAccessToken(accessToken);

    const ACCESS_MAX_AGE = 60 * 15; // 15 minutes
    const REFRESH_MAX_AGE = 60 * 60 * 24; // 1 day

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_MAX_AGE,
    });

    cookieStore.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_MAX_AGE,
    });

    // Refresh user_email and userRole cookies if they exist in the payload
    if (payload?.email) {
      cookieStore.set("user_email", payload.email, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: REFRESH_MAX_AGE, // Match refresh token duration
        path: "/",
      });
    }

    if (payload?.role) {
      cookieStore.set("userRole", payload.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: REFRESH_MAX_AGE, // Match refresh token duration
        path: "/",
      });
    }

    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
}

export async function validateUser() {
  try {
    const res = await authApi.validate();
    return res.data;
  } catch {
    return null;
  }
}