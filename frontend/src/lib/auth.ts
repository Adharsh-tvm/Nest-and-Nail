"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import authApi from "@/services/auth/auth.api";

export type UserRole = "client" | "worker" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean,
  accessToken: string;
  refreshToken?: string;
}

// Decodes a JWT payload without verifying signature.
// Returns parsed data or null if token is invalid.
function decodeJWT(token: string): { id: string; email: string; role: string; isVerified: boolean } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

/**
 * Reads auth cookies and returns the current user.
 * Returns null if no valid token is available.
 *
 * @returns {Promise<AuthUser | null>}
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return null;
  }

  let decoded = null;
  const tokenToUse = accessToken || refreshToken;

  if (tokenToUse) {
    decoded = decodeJWT(tokenToUse);
  }

  if (!decoded || !decoded.id || !decoded.email || !decoded.role) {
    return null;
  }

  return {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role.toLowerCase() as UserRole,
    isVerified: decoded.isVerified,
    accessToken: accessToken || "",
    refreshToken
  };
}

/**
 * Ensures the user is authenticated.
 * Redirects unauthenticated users to login.
 *
 * @returns {Promise<AuthUser>}
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user!;
}

/**
 * Ensures the user matches the required role.
 * Redirects to their own home page if mismatched.
 *
 * @param requiredRole - Role that is required to access the desired route
 * @returns {Promise<AuthUser>}
 */
export async function requireRole(requiredRole: UserRole): Promise<AuthUser> {
  const user = await requireAuth();

  if (user.role !== requiredRole) {
    redirect(`/${user.role}/home`);
  }

  return user;
}

/**
 * Returns true if the user has valid auth data.
 * Does not redirect or enforce protection.
 *
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Sends token to backend for validation.
 * Used when additional verification is required.
 *
 * @param token - JWT token to validate
 * @returns {Promise<boolean>}
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await authApi.verfify({token})

    return response.status === 200;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
}