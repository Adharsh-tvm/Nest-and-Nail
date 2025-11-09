
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type UserRole = "client" | "worker" | "admin";

export interface AuthUser {
  accessToken: string;
  refreshToken?: string;
  role: UserRole;
}

/**
 * Get the current user from cookies
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const userRole = cookieStore.get("userRole")?.value as UserRole | undefined;

  if (!accessToken || !userRole) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    role: userRole,
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