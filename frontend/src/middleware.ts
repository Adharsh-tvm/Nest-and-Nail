import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ─── Config ────────────────────────────────────────────────────────────────

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET
);
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const ACCESS_TOKEN_MAX_AGE =  15; // 15 minutes (matches session-actions.ts)
const REFRESH_TOKEN_MAX_AGE = 60 ; // 7 days

const PUBLIC_ROUTES = ["/login", "/signup"];

// ─── Helpers ───────────────────────────────────────────────────────────────

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

async function verifyAccessToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    if (
      typeof payload === "object" &&
      "id" in payload &&
      "email" in payload &&
      "role" in payload
    ) {
      return payload as unknown as JwtPayload;
    }
    return null;
  } catch {
    return null;
  }
}

async function verifyRefreshToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    if (
      typeof payload === "object" &&
      "id" in payload &&
      "email" in payload &&
      "role" in payload
    ) {
      return payload as unknown as JwtPayload;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Calls the backend refresh endpoint directly from middleware.
 * Returns new tokens or null if the refresh token is invalid/expired.
 *
 * This must be done in middleware (not via a server action) so we can
 * attach the new cookies to the actual response object.
 */
async function callRefreshEndpoint(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    // Handle both { data: { payload: ... } } and { payload: ... } shapes
    const payload = json?.data?.payload ?? json?.payload ?? json?.data ?? json;

    if (payload?.accessToken && payload?.refreshToken) {
      return {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/** Write the "logged out" cookies onto any response. */
function clearAuthCookies(response: NextResponse): void {
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  response.cookies.delete("user_email");
  response.cookies.delete("userRole");
}

/** Write fresh auth cookies onto a response. */
function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): void {
  const isProd = process.env.NODE_ENV === "production";

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

// ─── Middleware ─────────────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Pass through Next.js internals and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/") // let Next.js API routes handle themselves
  ) {
    return NextResponse.next();
  }

  const accessTokenCookie = req.cookies.get("accessToken")?.value;
  const refreshTokenCookie = req.cookies.get("refreshToken")?.value;

  const isPublicRoute =
    PUBLIC_ROUTES.some((p) => pathname.startsWith(p)) || pathname === "/";

  // ── Step 1: Try to establish a valid role ──────────────────────────────

  let userRole: string | null = null;
  let freshTokens: { accessToken: string; refreshToken: string } | null = null;

  if (accessTokenCookie) {
    const payload = await verifyAccessToken(accessTokenCookie);
    if (payload?.role) {
      userRole = payload.role;
    }
  }

  // ── Step 2: Access token missing or expired → try refresh ─────────────
  //
  // We ONLY attempt a refresh if:
  //   a) we don't have a valid role from the access token, AND
  //   b) there is a refresh token cookie present, AND
  //   c) that refresh token is still valid at the JWT level
  //
  // Checking (c) locally avoids a network round-trip when the refresh JWT
  // has already expired — this is the key fix for the "both expired" case.

  if (!userRole && refreshTokenCookie) {
    // First, verify the refresh token locally before hitting the network
    const refreshPayload = await verifyRefreshToken(refreshTokenCookie);

    if (refreshPayload?.role) {
      // JWT is still valid → attempt the backend refresh call
      const newTokens = await callRefreshEndpoint(refreshTokenCookie);

      if (newTokens) {
        // Verify the new access token so we can read the role
        const newPayload = await verifyAccessToken(newTokens.accessToken);
        if (newPayload?.role) {
          userRole = newPayload.role;
          freshTokens = newTokens;
        }
      }
      // If the backend call failed despite a locally-valid JWT, treat as
      // unauthenticated (e.g. user was blocked, token revoked server-side).
    }
    // If refreshPayload is null the refresh JWT is expired — fall through to
    // the "both expired" path below without making a network call.
  }

  // ── Step 3: Build the base response ───────────────────────────────────

  // ── Redirect authenticated user away from public routes ───────────────
  if (userRole && isPublicRoute) {
    const dest = new URL(`/${userRole}`, req.url);
    const response = NextResponse.redirect(dest);
    if (freshTokens) setAuthCookies(response, freshTokens.accessToken, freshTokens.refreshToken);
    return response;
  }

  // ── Redirect unauthenticated user away from protected routes ──────────
  if (!userRole && !isPublicRoute) {
    // Both tokens are expired/invalid — clear every stale cookie so the
    // browser stops replaying them, then send to /login.
    const response = NextResponse.redirect(new URL("/login", req.url));
    clearAuthCookies(response);
    return response;
  }

  // ── Enforce role-based path isolation ─────────────────────────────────
  if (userRole) {
    const allowedBase = `/${userRole}`;
    const onAllowedPath =
      pathname === allowedBase || pathname.startsWith(`${allowedBase}/`);

    if (!onAllowedPath && pathname !== "/") {
      // User is authenticated but trying to reach another role's pages
      const response = NextResponse.redirect(new URL(allowedBase, req.url));
      if (freshTokens) setAuthCookies(response, freshTokens.accessToken, freshTokens.refreshToken);
      return response;
    }

    // Happy path — allow through, attaching fresh cookies if we just refreshed
    const response = NextResponse.next();
    if (freshTokens) setAuthCookies(response, freshTokens.accessToken, freshTokens.refreshToken);

    // ── Step 4: Optional server-side user status check ──────────────────
    // Skip for Next.js Server Actions to avoid redundant backend calls.
    const isServerAction = req.headers.has("next-action");
    if (!isServerAction) {
      // We do NOT call validateUser() from middleware because:
      //   1. It runs in the Edge Runtime — no Node.js APIs.
      //   2. It adds latency to every non-SA request.
      //   3. The axios interceptor in individual page Server Actions
      //      already handles 401 responses from the backend.
      //
      // If you need to block banned/deleted users proactively you can
      // uncomment the block below, but ensure BACKEND_URL is reachable
      // from the Edge Runtime (no localhost in production).
      //
      // const validateRes = await fetch(`${BACKEND_URL}/api/auth/validate`, {
      //   headers: {
      //     Authorization: `Bearer ${freshTokens?.accessToken ?? accessTokenCookie}`,
      //     Cookie: req.headers.get("cookie") ?? "",
      //   },
      //   cache: "no-store",
      // });
      // if (!validateRes.ok) {
      //   const logoutResponse = NextResponse.redirect(new URL("/login", req.url));
      //   clearAuthCookies(logoutResponse);
      //   return logoutResponse;
      // }
    }

    return response;
  }

  // ── Public route, no auth — just let through ──────────────────────────
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
