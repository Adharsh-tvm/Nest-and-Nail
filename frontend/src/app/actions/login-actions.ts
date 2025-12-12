// app/actions/login-actions.ts
"use server";

import { cookies } from "next/headers";
import authApi from "@/services/api/auth.api";
import axios from "axios";

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
      const normalized = (e as any).normalizedMessage || (e as any).serverData?.message || (e as any).serverData?.error;
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
  const data = response?.data;

  if (!data?.accessToken) {
    return {
      error: "Login failed: No access token received",
      fields,
      errorId: Date.now(),
      success: false,
    };
  }

  const cookieStore = await cookies();
  const ACCESS_MAX_AGE = Number(process.env.MAX_AGE_ACCESS_TOKEN) || 60 * 60 * 24;
  const REFRESH_MAX_AGE = Number(process.env.MAX_AGE_REFRESH_TOKEN) || 60 * 60 * 24 * 30;

  if (data.accessToken) {
    cookieStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_MAX_AGE,
      path: "/",
    });
  }

  if (data.refreshToken) {
    cookieStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REFRESH_MAX_AGE,
      path: "/",
    });
  }

  if (data.user?.email_address) {
    cookieStore.set("user_email", data.user.email_address, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_MAX_AGE,
      path: "/",
    });
  }

  const userRole = data.user?.user_role?.toLowerCase() ?? null;
  if (userRole) {
    cookieStore.set("userRole", userRole, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_MAX_AGE,
      path: "/",
    });
  }

  // Return success payload (do NOT redirect on server)
  return {
    error: null,
    fields,
    success: true,
    userRole,
  };
}
