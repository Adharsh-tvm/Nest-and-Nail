"use server";

import authApi from "@/sources/api/auth.api";
import { JwtPayload } from "@/shared/types/JwtPayload";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;


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

export async function verifyRefreshToken(token: string): Promise<JwtPayload | null> {
  try {
    const key = new TextEncoder().encode(
      process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET
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

// ─── Refresh tokens (Server Action context — used from pages, not middleware) ─
//
// NOTE: The middleware handles refresh independently via a direct fetch() call
// so it can attach the new cookies to the actual Response object.
// This function is kept for any server-side page code that needs to refresh
// outside the middleware flow (rare, but possible).

export async function refreshTokens(refreshToken: string): Promise<boolean> {
  try {
    const res = await authApi.refresh(refreshToken);
    const data = res.data;

    if (!data.success) return false;

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
  } catch {
    return false;
  }
}

// ─── Validate user against backend (Server Action context) ──────────────────
//
// Called from individual pages/components to confirm the user is still active.
// The middleware does NOT call this on every request — only pages that
// need a fresh status check should call it.

export async function validateUser() {
  try {
    const res = await authApi.validate();
    return res.data;
  } catch {
    return null;
  }
}

// ─── Read the current session from cookies (Server Action / Server Component) ─

export async function getSession(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value ?? null;
  const refreshToken = cookieStore.get("refreshToken")?.value ?? null;

  let role: string | null = null;
  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    role = payload?.role ?? null;
  }

  return { accessToken, refreshToken, role };
}