"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Client-side protection to prevent authenticated users from accessing auth pages
 * This works in conjunction with middleware for belt-and-suspenders protection
 */
export function ClientSideAuthProtection() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we're on an auth page
        const isAuthPage = pathname === "/login" || 
                          pathname.startsWith("/login/") || 
                          pathname.startsWith("/signup");

        if (!isAuthPage) return;

        // Check authentication status
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/client/me`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store", // Never cache this request
          }
        );

        // If user is authenticated and on auth page, redirect them
        if (response.ok) {
          const data = await response.json();
          const role = data.user?.user_role?.toLowerCase();
          
          console.log("🚨 Authenticated user on auth page, redirecting...");
          
          if (role === "client") {
            router.replace("/client/home");
          } else if (role === "worker") {
            router.replace("/worker/home");
          } else if (role === "admin") {
            router.replace("/admin/dashboard");
          }
        }
      } catch (error) {
        // If check fails, user is probably not authenticated - allow access
        console.log("Auth check failed (expected if not logged in):", error);
      }
    };

    checkAuth();
  }, [pathname, router]);

  return null;
}

/**
 * Add this to your protected pages (dashboard/home) to prevent back navigation
 * This is optional but provides better UX
 */
export function PreventBackNavigation() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Add a history entry so back button stays on current page
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // Push state again to prevent going back
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}