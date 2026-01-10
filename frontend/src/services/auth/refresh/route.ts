import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const redirect = req.nextUrl.searchParams.get("redirect") || "/";

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const res = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const json = await res.json();
  const data = json.data ?? json;

  const response = NextResponse.redirect(
    new URL(redirect, req.url)
  );

  response.cookies.set("accessToken", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  response.cookies.set("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
