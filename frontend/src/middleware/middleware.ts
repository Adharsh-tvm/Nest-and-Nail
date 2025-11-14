import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Decodes a JWT payload without verifying signature.
// Returns parsed data or null on failure.
function decodeJWT(token: string): { id: string; email: string; role: string } | null {
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
 * Controls route access based on auth state and user role.
 * Handles redirects for protected and restricted routes.
 *
 * @param request - Incoming request from Next.js runtime
 * @returns Redirect or NextResponse.next()
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🔍 Middleware checking:", pathname);

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = !!(accessToken || refreshToken);

  let userRole: string | null = null;

  // Extract role from access or refresh token.
  if (accessToken) {
    const decoded = decodeJWT(accessToken);
    if (decoded) userRole = decoded.role?.toLowerCase();
  } else if (refreshToken) {
    const decoded = decodeJWT(refreshToken);
    if (decoded) userRole = decoded.role?.toLowerCase();
  }

  const isLoginPage = pathname === "/login" || pathname.startsWith("/login/");
  const isSignupPage = pathname.startsWith("/signup");
  const isAuthRoute = isLoginPage || isSignupPage;

  // Redirect authenticated users away from login and signup.
  if (isAuthRoute && isAuthenticated && userRole) {
    const dashboardUrl =
      userRole === "client"
        ? new URL("/client/home", request.url)
        : userRole === "worker"
        ? new URL("/worker/home", request.url)
        : new URL("/admin/dashboard", request.url);

    const response = NextResponse.redirect(dashboardUrl, { status: 308 });

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");

    return response;
  }

  // Allow unauthenticated access to login and signup.
  if (isAuthRoute && !isAuthenticated) {
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  // Allow access to public home page.
  if (pathname === "/") {
    return NextResponse.next();
  }

  const isProtectedRoute =
    pathname.startsWith("/client") ||
    pathname.startsWith("/worker") ||
    pathname.startsWith("/admin");

  // Block unauthenticated users from protected routes.
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    const response = NextResponse.redirect(loginUrl, { status: 303 });
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  }

  // Block users trying to access the wrong role-based area.
  if (isAuthenticated && userRole && isProtectedRoute) {
    if (pathname.startsWith("/client") && userRole !== "client") {
      return NextResponse.redirect(new URL(`/${userRole}/home`, request.url), {
        status: 303
      });
    }
    if (pathname.startsWith("/worker") && userRole !== "worker") {
      return NextResponse.redirect(new URL(`/${userRole}/home`, request.url), {
        status: 303
      });
    }
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL(`/${userRole}/home`, request.url), {
        status: 303
      });
    }
  }

  // Handle invalid tokens where role cannot be extracted.
  if (isProtectedRoute && isAuthenticated && !userRole) {
    const response = NextResponse.redirect(new URL("/login", request.url), {
      status: 303
    });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  // Default allow.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)"]
};
