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

  // 1️⃣ Access token present → allow
  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload) {
      return NextResponse.next();
    }
  }

  // 2️⃣ No access token BUT refresh token exists → refresh & retry
  if (!accessToken && refreshToken) {
    const refreshed = await refreshTokens(refreshToken);

    if (refreshed) {
      // 🔁 IMPORTANT: redirect to SAME URL
      // so next request has new access token
      return NextResponse.redirect(req.nextUrl);
    }
  }

  // 3️⃣ No tokens → logout
  if (!isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
