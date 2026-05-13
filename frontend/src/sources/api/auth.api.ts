import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";

/* ---------------- PAYLOADS ---------------- */

export type LoginPayload = {
  email_address: string;
  password: string;
};

export type GoogleAuthPayload = {
  name: string;
  email: string;
  role?: string;
};

/* ---------------- RESPONSE PAYLOADS ---------------- */

export type AuthPayload = {
  user: {
    user_id: string;
    user_name: string;
    email_address: string;
    user_role: string;
    isBlocked: boolean;
    isVerified: string;
  };
  accessToken: string;
  refreshToken: string;
};

/* ---------------- API ---------------- */

export const authApi = {
  login: (payload: LoginPayload) =>
    axiosInstance.post<ApiResponse<AuthPayload>>(
      "/api/auth/login",
      payload
    ),

  signup: (payload: Record<string, unknown>) =>
    axiosInstance.post<ApiResponse<AuthPayload>>(
      "/api/auth/register",
      payload
    ),

  refresh: (refreshToken: string) =>
    axiosInstance.post<ApiResponse<{
      accessToken: string;
      refreshToken: string;
    }>>("/api/auth/refresh", { refreshToken }),

  logout: () =>
    axiosInstance.post<ApiResponse<null>>("/api/auth/logout"),

  validate: () =>
    axiosInstance.get<ApiResponse<{
      id: string;
      role: string;
      isBlocked: boolean;
    }>>("/api/auth/validate"),

  sendOtp: (payload: { email_address: string; role?: string }) =>
    axiosInstance.post<ApiResponse<null>>(
      "/api/auth/send-otp",
      payload
    ),

  verifyOtp: (payload: { email_address: string; otp: string }) =>
    axiosInstance.post<ApiResponse<null>>(
      "/api/auth/verify-otp",
      payload
    ),

  googleAuth: (payload: GoogleAuthPayload) =>
    axiosInstance.post<ApiResponse<AuthPayload>>(
      "/api/auth/google",
      payload
    ),

  forgotPassword: (payload: { email_address: string }) =>
    axiosInstance.post<ApiResponse<null>>(
      "/api/auth/forgot-password",
      payload
    ),

  resetPassword: (payload: {
    email_address: string;
    newPassword: string;
    confirmPassword: string;
  }) =>
    axiosInstance.post<ApiResponse<null>>(
      "/api/auth/reset-password",
      payload
    ),
};

export default authApi;
