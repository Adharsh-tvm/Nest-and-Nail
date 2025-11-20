"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import authApi from "@/services/auth/auth.api";
import { AxiosError } from "axios";

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
      console.log("AuthProvider: Fetching user...");
      const response = await authApi.getMe();
      
      // ===== NEW: Better error handling =====
      if (response.status === 200 && response.data?.user) {
        console.log("AuthProvider: User fetched successfully", response.data.user);
        setUser(response.data.user);
      } else {
        console.warn("AuthProvider: Invalid response from getMe", response);
        setUser(null);
      }
      // ===== END NEW CODE =====
      
    } catch (error) {
      // ===== NEW: Differentiate error types =====
      const axiosError = error as AxiosError;
      
      if (axiosError?.response?.status === 401 || axiosError?.response?.status === 403) {
        console.log("AuthProvider: User is not authenticated (401/403)");
        setUser(null);
      } else {
        console.error("AuthProvider: Error fetching user:", error);
        // Don't immediately clear user on network errors - could be transient
        // User will remain null but we won't aggressively redirect
        setUser(null);
      }
      // ===== END NEW CODE =====
      
    } finally {
      console.log("AuthProvider: Loading complete");
      setIsLoading(false);
    }
  };

  /**
   * Logs out the user by clearing tokens.
   * Resets auth state and redirects to login.
   */
  const logout = async () => {
    try {
      await authApi.logout();
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
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}