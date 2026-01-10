import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse, SuccessResponse } from "@/shared/types/responseTypes";

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

export type LoginPayloadResponse = {
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

export const authApi = {
  login: (payload: LoginPayload) =>
    axiosInstance.post<ApiResponse<LoginPayloadResponse>>(
      "/api/auth/login",
      payload
    ),

  signup: (payload: any) =>
    axiosInstance.post("/api/auth/register", payload),

 refresh: (refreshToken: string) =>
    axiosInstance.post<
      SuccessResponse<{
        accessToken: string;
        refreshToken: string;
      }>
    >("/api/auth/refresh", {
      refreshToken,
    }),

  verify: (payload: { token: string }) =>
    axiosInstance.post("/api/auth/verify", payload),

  logout: () => axiosInstance.post("/api/auth/logout"),

  sendOtp: (payload: { email_address: string; role?: string }) =>
    axiosInstance.post("/api/auth/send-otp", payload),

  verifyOtp: (payload: { email_address: string; otp: string }) =>
    axiosInstance.post("/api/auth/verify-otp", payload),

  googleAuth: (payload: GoogleAuthPayload) =>
    axiosInstance.post<googleAuthResponse>("/api/auth/google", payload),

  forgotPassword: (payload: { email_address: string }) =>
    axiosInstance.post("/api/auth/forgot-password", payload),

  resetPassword: (payload: { email_address: string; newPassword: string; confirmPassword: string }) =>
    axiosInstance.post("/api/auth/reset-password", payload),
};

export default authApi;

