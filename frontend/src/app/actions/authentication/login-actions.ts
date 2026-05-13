// app/actions/login-actions.ts
"use server";

import { cookies } from "next/headers";
import authApi, { AuthPayload } from "@/sources/api/user/auth.api";
import axios from "axios";
import { ApiResponse } from "@/shared/types/responseTypes";

interface CustomAxiosError {
  normalizedMessage?: string;
  serverData?: {
    message?: string;
    error?: string;
  };
}

export type LoginState = {
  error?: string | null;
  fields?: { email?: string };
  errorId?: number;
  success?: boolean;
  userRole?: string | null;
};

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string) ?? "";
  const password = (formData.get("password") as string) ?? "";
  const fields = { email };

  // Basic validation
  if (!email || !password) {
    return {
      error: "All fields are required",
      fields,
      errorId: Date.now(),
      success: false,
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      error: "Please enter a valid email address",
      fields,
      errorId: Date.now(),
      success: false,
    };
  }

  // Call auth API
  let response;
  try {
    response = await authApi.login({
      email_address: email,
      password,
    });
  } catch (e: unknown) {
    // Prefer axios.isAxiosError (works across bundlers) and normalizedMessage from interceptor
    if (axios.isAxiosError(e)) {
      const customErr = e as unknown as CustomAxiosError;
      const normalized = customErr.normalizedMessage || customErr.serverData?.message || customErr.serverData?.error;
      return {
        error: normalized || (e as Error).message || "Failed to call auth service",
        fields,
        errorId: Date.now(),
        success: false,
      };
    }

    return {
      error: (e as Error)?.message || "Failed to call auth service",
      fields,
      errorId: Date.now(),
      success: false,
    };
  }
  const data = response.data as ApiResponse<{
    user: AuthPayload["user"];
    accessToken: string;
    refreshToken: string;
  }>;

  if (!data.success) {
    return {
      error: data.message || "Login failed",
      fields,
      errorId: Date.now(),
      success: false,
    };
  }

  const { user, accessToken, refreshToken } = data.payload;

  const cookieStore = await cookies();

  const ACCESS_MAX_AGE = Number(process.env.MAX_AGE_ACCESS_TOKEN) || 60 * 60 * 24;
  const REFRESH_MAX_AGE = Number(process.env.MAX_AGE_REFRESH_TOKEN) || 60 * 60 * 24 * 30;

  if (!accessToken) {
    return {
      error: "Login failed: No access token received",
      fields,
      errorId: Date.now(),
      success: false,
    };
  }


  if (accessToken) {
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_MAX_AGE,
      path: "/",
    });
  }

  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REFRESH_MAX_AGE,
      path: "/",
    });
  }

  if (user?.email_address) {
    cookieStore.set("user_email", user.email_address, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_MAX_AGE,
      path: "/",
    });
  }

  const userRole = user?.user_role?.toLowerCase() ?? null;
  if (userRole) {
    cookieStore.set("userRole", userRole, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_MAX_AGE,
      path: "/",
    });
  }

  return {
    error: null,
    fields,
    success: true,
    userRole,
  };
}
