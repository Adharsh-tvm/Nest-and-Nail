// services/auth/auth.api.ts
import axiosInstance from "@/lib/axiosInstance";
import type { AxiosResponse } from "axios";

export type LoginPayload = {
  email_address: string;
  password: string;
};

export type GoogleAuthPayload = {
  name: string,
  email: string,
  role?: string
};

type googleAuthResponse = {
  success: boolean;
  message: string;
  payload?: {
    user: any,
    accessToken: string;
    refreshToken: string
  }
}

export type AuthResponse<UserType = any> = {
  user?: UserType;
  accessToken?: string;
  refreshToken?: string;
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

  sendOtp: (payload: { email_address: string; role?: string }) =>
    axiosInstance.post("/api/auth/send-otp", payload),

  verifyOtp: (payload: { email_address: string; otp: string }) =>
    axiosInstance.post("/api/auth/verify-otp", payload),

  googleAuth: (payload: GoogleAuthPayload) =>
    axiosInstance.post<googleAuthResponse>("/api/auth/google", payload),
};

export default authApi;

