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

  if (userRole && isPublicRoute) {
    return NextResponse.redirect(new URL(`/${userRole}`, req.url));
  }

  if (!userRole && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (userRole) {
    const allowedBase = `/${userRole}`;

    if (
      pathname === allowedBase ||
      pathname.startsWith(`${allowedBase}/`)
    ) {
      return NextResponse.next();
    }

    if (pathname === "/") {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(allowedBase, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
