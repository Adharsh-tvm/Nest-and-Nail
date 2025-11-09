import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type UserRole = "client" | "worker" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  accessToken: string;
  refreshToken?: string;
}

// Helper function to decode JWT without verification
function decodeJWT(token: string): { id: string; email: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

/**
 * Get the current user from cookies
 * Returns null if not authenticated
 * SECURITY: Gets role from JWT token, not from userRole cookie
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return null;
  }

  // Try to decode access token first
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
    accessToken: accessToken || "",
    refreshToken,
  };
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use this in Server Components that need authentication
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Require specific role - redirects if user doesn't have the required role
 */
export async function requireRole(requiredRole: UserRole): Promise<AuthUser> {
  const user = await requireAuth();

  if (user.role !== requiredRole) {
    // Redirect to their correct dashboard
    redirect(`/${user.role}/home`);
  }

  return user;
}

/**
 * Check if user is authenticated (doesn't redirect)
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Verify token with backend (optional - for extra security)
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
}