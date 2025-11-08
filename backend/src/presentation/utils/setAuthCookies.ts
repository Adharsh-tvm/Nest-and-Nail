import { Response } from "express";

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  // Access Token - short-lived (15 minutes)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only HTTPS in production
    sameSite: "lax", // IMPORTANT: 'lax' allows cross-site requests
    maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    path: "/",
  });

  // Refresh Token - long-lived (7 days)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // IMPORTANT: 'lax' allows cross-site requests
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/",
  });
}

// Suggested fix for AuthController.register():
// Change from:
//   res.status(HttpStatusCode.CREATED).json(createdUser);
// To:
//   res.status(HttpStatusCode.CREATED).json({ user: result.user });