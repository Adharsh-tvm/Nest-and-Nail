import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { AUTH_ROUTES } from "@/sources/constant-api";

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
      AUTH_ROUTES.LOGIN,
      payload
    ),

  signup: (payload: Record<string, unknown>) =>
    axiosInstance.post<ApiResponse<AuthPayload>>(
      AUTH_ROUTES.REGISTER,
      payload
    ),

  refresh: (refreshToken: string) =>
    axiosInstance.post<ApiResponse<{
      accessToken: string;
      refreshToken: string;
    }>>(AUTH_ROUTES.REFRESH, { refreshToken }),

  logout: () =>
    axiosInstance.post<ApiResponse<null>>(AUTH_ROUTES.LOGOUT),

  validate: () =>
    axiosInstance.get<ApiResponse<{
      id: string;
      role: string;
      isBlocked: boolean;
    }>>(AUTH_ROUTES.VALIDATE),

  sendOtp: (payload: { email_address: string; role?: string }) =>
    axiosInstance.post<ApiResponse<null>>(
      AUTH_ROUTES.SEND_OTP,
      payload
    ),

  verifyOtp: (payload: { email_address: string; otp: string }) =>
    axiosInstance.post<ApiResponse<null>>(
      AUTH_ROUTES.VERIFY_OTP,
      payload
    ),

  googleAuth: (payload: GoogleAuthPayload) =>
    axiosInstance.post<ApiResponse<AuthPayload>>(
      AUTH_ROUTES.GOOGLE,
      payload
    ),

  forgotPassword: (payload: { email_address: string }) =>
    axiosInstance.post<ApiResponse<null>>(
      AUTH_ROUTES.FORGOT_PASSWORD,
      payload
    ),

  resetPassword: (payload: {
    email_address: string;
    newPassword: string;
    confirmPassword: string;
  }) =>
    axiosInstance.post<ApiResponse<null>>(
      AUTH_ROUTES.RESET_PASSWORD,
      payload
    ),

  changePassword: (payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) =>
    axiosInstance.patch<ApiResponse<null>>(
      AUTH_ROUTES.CHANGE_PASSWORD,
      payload
    ),
};

export default authApi;
