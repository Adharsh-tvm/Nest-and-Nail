import { Response } from "express";

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {

  const accessTokenMaxAge = Number(process.env.ACCESS_TOKEN_MAX_AGE) * 1000;
  const refreshTokenMaxAge = Number(process.env.REFRESH_TOKEN_MAX_AGE) * 1000;


  // Access Token - short-lived (15 minutes)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: accessTokenMaxAge,
    path: "/",
  });

  // Refresh Token - long-lived (7 days)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: refreshTokenMaxAge,
    path: "/",
  });
}

