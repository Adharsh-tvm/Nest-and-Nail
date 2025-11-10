"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

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

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/client/me`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store"
          }
        );

        if (response.ok) {
          const data = await response.json();
          const role = data.user?.user_role?.toLowerCase();

          if (role === "client") router.replace("/client/home");
          else if (role === "worker") router.replace("/worker/home");
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
