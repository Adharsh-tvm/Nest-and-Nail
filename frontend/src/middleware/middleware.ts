import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🔍 Middleware checking:", pathname);

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthenticated = !!(accessToken || refreshToken);

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

  const isLoginPage = pathname === "/login" || pathname.startsWith("/login/");
  const isSignupPage = pathname.startsWith("/signup");
  const isAuthRoute = isLoginPage || isSignupPage;

  // CRITICAL: Block authenticated users from auth pages
  if (isAuthRoute && isAuthenticated && userRole) {
    console.log(`🔒 BLOCKING: Logged-in ${userRole} tried to access ${pathname}`);
    
    const dashboardUrl = userRole === "client" 
      ? new URL("/client/home", request.url)
      : userRole === "worker"
      ? new URL("/worker/home", request.url)
      : new URL("/admin/dashboard", request.url);
    
    // Use 308 (Permanent Redirect) for faster redirects
    const response = NextResponse.redirect(dashboardUrl, { status: 308 });
    
    // CRITICAL: Prevent browser caching and add instant redirect
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    
    return response;
  }

  // Allow unauthenticated users to access auth pages
  if (isAuthRoute && !isAuthenticated) {
    console.log(`✅ Allowing unauthenticated access to: ${pathname}`);
    
    // Add no-cache headers to auth pages too
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  }

  if (pathname === "/") {
    console.log(`✅ Allowing access to homepage`);
    return NextResponse.next();
  }

  const isProtectedRoute =
    pathname.startsWith("/client") ||
    pathname.startsWith("/worker") ||
    pathname.startsWith("/admin");

  if (isProtectedRoute && !isAuthenticated) {
    console.log(`🔒 BLOCKING: Unauthenticated user tried to access ${pathname}`);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    
    const response = NextResponse.redirect(loginUrl, { status: 303 });
    
    // Add aggressive cache prevention for protected routes
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  }

  // Role-based access control
  if (isAuthenticated && userRole && isProtectedRoute) {
    if (pathname.startsWith("/client") && userRole !== "client") {
      console.log(`⚠️ BLOCKING: ${userRole} tried to access client area`);
      const correctUrl = new URL(`/${userRole}/home`, request.url);
      return NextResponse.redirect(correctUrl, { status: 303 });
    }
    if (pathname.startsWith("/worker") && userRole !== "worker") {
      console.log(`⚠️ BLOCKING: ${userRole} tried to access worker area`);
      const correctUrl = new URL(`/${userRole}/home`, request.url);
      return NextResponse.redirect(correctUrl, { status: 303 });
    }
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      console.log(`⚠️ BLOCKING: ${userRole} tried to access admin area`);
      const correctUrl = new URL(`/${userRole}/home`, request.url);
      return NextResponse.redirect(correctUrl, { status: 303 });
    }
  }

  // Invalid token handling
  if (isProtectedRoute && isAuthenticated && !userRole) {
    console.log("⚠️ BLOCKING: Invalid token - couldn't extract role");
    const response = NextResponse.redirect(new URL("/login", request.url), { status: 303 });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  console.log(`✅ Allowing access to: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
};