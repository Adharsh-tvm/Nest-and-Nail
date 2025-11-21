"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import authApi from "@/services/auth/auth.api";

/**
 * Blocks authenticated users from visiting login or signup pages
 */
export function ClientSideAuthProtection() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthPage =
          pathname === "/login" ||
          pathname.startsWith("/login/") ||
          pathname.startsWith("/signup");

        if (!isAuthPage) return;

        const response = await authApi.getMe()
    
        const data = await response.data;

        if (response.data) {
          const role = data.user?.user_role?.toLowerCase();

          if (role === "client") router.replace("/client/home");
          else if (role === "worker") router.replace("/worker/portal");
          else if (role === "admin") router.replace("/admin/dashboard");
        }
      } catch {
        console.log("Auth check failed, continuing");
      }
    };

    checkAuth();
  }, [pathname, router]);

  return null;
}

/**
 * Prevents users from navigating back from protected pages
 */
export function PreventBackNavigation() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}
