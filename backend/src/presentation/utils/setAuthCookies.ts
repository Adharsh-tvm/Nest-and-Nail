import { Response } from "express";

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  console.log("[setAuthCookies] Setting cookies...");
  console.log(`[setAuthCookies] AccessToken length: ${accessToken?.length}`);
  console.log(`[setAuthCookies] RefreshToken length: ${refreshToken?.length}`);
  console.log(`[setAuthCookies] NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`[setAuthCookies] ACCESS_TOKEN_MAX_AGE: ${process.env.ACCESS_TOKEN_MAX_AGE}`);
  console.log(`[setAuthCookies] REFRESH_TOKEN_MAX_AGE: ${process.env.REFRESH_TOKEN_MAX_AGE}`);

  const accessTokenMaxAge = Number(process.env.ACCESS_TOKEN_MAX_AGE) * 1000;
  const refreshTokenMaxAge = Number(process.env.REFRESH_TOKEN_MAX_AGE) * 1000;

  console.log(`[setAuthCookies] Calculated accessTokenMaxAge: ${accessTokenMaxAge}ms`);
  console.log(`[setAuthCookies] Calculated refreshTokenMaxAge: ${refreshTokenMaxAge}ms`);

  // Access Token - short-lived (15 minutes)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: accessTokenMaxAge,
    path: "/",
  });

  console.log("[setAuthCookies] Access token cookie set");

  // Refresh Token - long-lived (7 days)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: refreshTokenMaxAge,
    path: "/",
  });

  console.log("[setAuthCookies] Refresh token cookie set");
  console.log("[setAuthCookies] Both cookies set successfully");
}