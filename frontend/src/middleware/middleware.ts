import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper function to decode JWT without verification (just to read the role)
function decodeJWT(token: string): { id: string; email: string; role: string } | null {
  try {
    // JWT structure: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decode the payload (base64url)
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

// Public routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get tokens from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Check if user is authenticated
  const isAuthenticated = !!(accessToken || refreshToken);

  // Get the actual role from the JWT token (not from userRole cookie!)
  let userRole: string | null = null;
  
  if (accessToken) {
    const decoded = decodeJWT(accessToken);
    if (decoded) {
      userRole = decoded.role?.toLowerCase();
      console.log("🔐 Role from JWT token:", userRole);
    }
  } else if (refreshToken) {
    const decoded = decodeJWT(refreshToken);
    if (decoded) {
      userRole = decoded.role?.toLowerCase();
      console.log("🔐 Role from refresh token:", userRole);
    }
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Allow public routes for everyone
  if (isPublicRoute) {
    // If authenticated user tries to access auth pages, redirect to their dashboard
    if (isAuthenticated && userRole && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
      if (userRole === "client") {
        return NextResponse.redirect(new URL("/client/home", request.url));
      } else if (userRole === "worker") {
        return NextResponse.redirect(new URL("/worker/home", request.url));
      } else if (userRole === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtectedRoute =
    pathname.startsWith("/client") ||
    pathname.startsWith("/worker") ||
    pathname.startsWith("/admin");

  // If not authenticated and trying to access protected route, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Role-based access control using JWT token
  if (isAuthenticated && userRole) {
    // Check if user is trying to access a route that doesn't match their role
    if (pathname.startsWith("/client") && userRole !== "client") {
      console.log(`⚠️ Access denied: ${userRole} tried to access /client`);
      return NextResponse.redirect(new URL(`/${userRole}/home`, request.url));
    }
    if (pathname.startsWith("/worker") && userRole !== "worker") {
      console.log(`⚠️ Access denied: ${userRole} tried to access /worker`);
      return NextResponse.redirect(new URL(`/${userRole}/home`, request.url));
    }
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      console.log(`⚠️ Access denied: ${userRole} tried to access /admin`);
      return NextResponse.redirect(new URL(`/${userRole}/home`, request.url));
    }
  }

  // If we have tokens but couldn't decode role, redirect to login (invalid token)
  if (isProtectedRoute && isAuthenticated && !userRole) {
    console.log("⚠️ Invalid token - couldn't extract role");
    const response = NextResponse.redirect(new URL("/login", request.url));
    // Clear invalid cookies
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    response.cookies.delete("userRole");
    return response;
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
};