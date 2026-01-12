import { NextRequest, NextResponse } from "next/server";
import {
  refreshTokens,
  verifyAccessToken,
} from "./app/actions/authentication/session-actions";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.includes("_next") ||
    pathname.includes("favicon")
  ) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const publicRoutes = ["/login", "/signup"];
  const isPublicRoute =
    publicRoutes.some((p) => pathname.startsWith(p)) ||
    pathname === "/";

  let userRole: string | null = null;

  // 1️⃣ Verify access token
  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload?.role) {
      userRole = payload.role;
    }
  }

  // 2️⃣ No access token but refresh exists → refresh & retry
  if (!userRole && !accessToken && refreshToken) {
    const refreshed = await refreshTokens(refreshToken);
    if (refreshed) {
      return NextResponse.redirect(req.nextUrl);
    }
  }

  // 3️⃣ Logged-in user trying to access login/signup → block
  if (userRole && isPublicRoute) {
    return NextResponse.redirect(new URL(`/${userRole}`, req.url));
  }

  // 4️⃣ Not authenticated → logout
  if (!userRole && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 5️⃣ ROLE ENFORCEMENT (🔥 THIS FIXES YOUR ISSUE 🔥)
  if (userRole) {
    const allowedBase = `/${userRole}`;

    // allow root dashboard and its subroutes
    if (
      pathname === allowedBase ||
      pathname.startsWith(`${allowedBase}/`)
    ) {
      return NextResponse.next();
    }

    // allow homepage
    if (pathname === "/") {
      return NextResponse.next();
    }

    // ❌ trying to access another role
    return NextResponse.redirect(new URL(allowedBase, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
