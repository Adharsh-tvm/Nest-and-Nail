// services/auth/auth.api.ts
import axiosInstance from "@/lib/axiosInstance";
import type { AxiosResponse } from "axios";

export type LoginPayload = {
  email_address: string;
  password: string;
};

export type GoogleAuthPayload = {
  accessToken: string;
  role?: string;
  mode?: "signup" | "login";
};

export type AuthResponse<UserType = any> = {
  accessToken?: string;
  refreshToken?: string;
  user?: UserType;
};

export const authApi = {
  login: (payload: LoginPayload) =>
    axiosInstance.post("/api/auth/login", payload),

  signup: (payload: any) =>
    axiosInstance.post("/api/auth/register", payload),

  refresh: () => axiosInstance.post("/api/auth/refresh"),

  verify: (payload: { token: string }) =>
    axiosInstance.post("/api/auth/verify", payload),

  logout: () => axiosInstance.post("/api/auth/logout"),

  getMe: (config?: any) => axiosInstance.get("/api/auth/me", config),

  /**
   * Send OTP to user email.
   * Backend expects: { email_address: string, role?: string }
   */
  sendOtp: (payload: { email_address: string; role?: string }) =>
    axiosInstance.post("/api/auth/send-otp", payload),

  /**
   * Verify OTP.
   * Backend expects: { email_address: string, otp: string }
   */
  verifyOtp: (payload: { email_address: string; otp: string }) =>
    axiosInstance.post("/api/auth/verify-otp", payload),

  googleAuth: (payload: GoogleAuthPayload) =>
    axiosInstance.post<AuthResponse>("/api/auth/google", payload),
};

export default authApi;
