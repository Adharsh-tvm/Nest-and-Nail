import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = {
  client: ["/client"],
  worker: ["/worker"],
  admin: ["/admin"],
};

// Public routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get tokens and role from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // Check if user is authenticated
  const isAuthenticated = !!(accessToken || refreshToken);

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Allow public routes for everyone
  if (isPublicRoute) {
    // If authenticated user tries to access auth pages, redirect to their dashboard
    if (isAuthenticated && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
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
    // Store the original URL to redirect back after login
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Check role-based access
  if (isAuthenticated && userRole) {
    // Check if user is trying to access a route for their role
    if (pathname.startsWith("/client") && userRole !== "client") {
      return NextResponse.redirect(new URL(`/${userRole}/home`, request.url));
    }
    if (pathname.startsWith("/worker") && userRole !== "worker") {
      return NextResponse.redirect(new URL(`/${userRole}/home`, request.url));
    }
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL(`/${userRole}/home`, request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
};