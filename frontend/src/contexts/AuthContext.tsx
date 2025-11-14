"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import authApi from "@/services/auth/auth.api";

export type UserRole = "client" | "worker" | "admin";

interface User {
  user_id: string;
  user_name: string;
  email_address: string;
  user_role: UserRole;
  phone_number?: number;
  profileImageUrl?: string;
  isBlocked: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Wraps the app with authentication state.
 * Manages user data, loading state and auth actions.
 * Fetches user on initial load.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchUser();
  }, []);

  /**
   * Retrieves current user session from backend.
   * Updates auth state based on response.
   * Resets loading once complete.
   */
  const fetchUser = async () => {
    try {
      const response = await authApi.getMe()

      if (response.data) {
        const data = await response.data
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logs out the user by clearing tokens.
   * Resets auth state and redirects to login.
   * Ensures navigation cannot return to protected pages.
   */

  const logout = async () => {
    try {
      await authApi.logout()

      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie =
        "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      setUser(null);
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /**
   * Refreshes the current user state.
   * Useful after profile updates or token refresh.
   */
  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Accesses the authentication context.
 * Ensures hook is used only inside AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
