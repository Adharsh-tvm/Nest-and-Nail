// app/actions/signup-actions.ts
"use server";

import { cookies } from "next/headers";
import { AxiosError } from "axios";
import authApi from "@/services/auth/auth.api";

// ---------------- Types ----------------

type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "client" | "worker";
};

export type SignupResponse = {
  error: string | null;
  fields?: Partial<SignupFormData>;
  otpSent?: boolean;
};

type CompleteSignupData = {
  name: string;
  email: string;
  password: string;
  role: "client" | "worker";
  otp: string;
};

export type CompleteSignupResponse = {
  success: boolean;
  error: string | null;
  isVerified?: boolean;
};

// ----------------------
// STEP 1: START SIGNUP (SEND OTP)
// ----------------------

export async function signup(
  prevState: SignupResponse,
  formData: FormData
): Promise<SignupResponse> {
  const name = (formData.get("name") as string) || "";
  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";
  const confirmPassword = (formData.get("confirmPassword") as string) || "";
  const role = (formData.get("role") as "client" | "worker") || "client";

  const fields = { name, email, role };

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required", fields };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match", fields };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long", fields };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address", fields };
  }

  try {
    await authApi.sendOtp({
      email_address: email,
      role,
    });

    return {
      error: null,
      otpSent: true,
      fields,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("signup -> sendOtp failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      return {
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to send OTP. Please try again.",
        fields,
      };
    }

    console.error("signup -> unknown error:", error);
    return {
      error: "Network error. Please check your connection and try again.",
      fields,
    };
  }
}

// ----------------------
// STEP 2: COMPLETE SIGNUP AFTER OTP
// ----------------------

export async function completeSignup(
  data: CompleteSignupData
): Promise<CompleteSignupResponse> {
  try {
    // 🔍 CRITICAL DEBUG: Log what we received
    console.log("[completeSignup SERVER] Received data:", {
      name: data.name,
      email: data.email,
      role: data.role,
      hasPassword: !!data.password,
      passwordLength: data.password?.length,
      passwordPreview: data.password ? data.password.substring(0, 3) + "..." : "[EMPTY]"
    });

    // Verify OTP via authApi
    const otpResponse = await authApi.verifyOtp({
      email_address: data.email,
      otp: data.otp,
    });

    console.log("[completeSignup SERVER] OTP verified successfully");

    if (!otpResponse?.data) {
      return { success: false, error: "Invalid or expired OTP" };
    }

    // 🔍 CRITICAL: Log the exact payload being sent to backend
    const signupPayload = {
      user_name: data.name,
      email_address: data.email,
      password: data.password,
      user_role: data.role,
    };

    console.log("[completeSignup SERVER] Payload to be sent:", {
      user_name: signupPayload.user_name,
      email_address: signupPayload.email_address,
      user_role: signupPayload.user_role,
      password_exists: !!signupPayload.password,
      password_length: signupPayload.password?.length,
      password_preview: signupPayload.password
        ? signupPayload.password.substring(0, 3) + "..."
        : "[EMPTY]",
      // 🚨 Let's see the ACTUAL password for debugging (REMOVE THIS IN PRODUCTION!)
      ACTUAL_PASSWORD_DEBUG: signupPayload.password
    });

    // Register user
    console.log("[completeSignup SERVER] Calling authApi.signup...");
    const registerResponse = await authApi.signup(signupPayload);
    console.log("[completeSignup SERVER] Registration response received");

    const registerData = registerResponse?.data;

    if (!registerData) {
      return { success: false, error: "Signup failed: empty response" };
    }

    const { accessToken, refreshToken, user } = registerData;

    if (!accessToken || !refreshToken) {
      console.error("completeSignup -> missing tokens:", registerData);
      return {
        success: false,
        error: "Signup failed: No tokens received",
      };
    }

    // Persist tokens & role in cookies (server-side)
    const cookieStore = await cookies();

    const ACCESS_MAX_AGE = Number(process.env.MAX_AGE_ACCESS_TOKEN);
    const REFRESH_MAX_AGE = Number(process.env.MAX_AGE_REFRESH_TOKEN);

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_MAX_AGE, // 15 minutes
      path: "/",
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REFRESH_MAX_AGE, // 7 days
      path: "/",
    });

    const userRole = (user?.user_role || user?.role || "").toString().toLowerCase();
    if (!userRole) {
      console.error("completeSignup -> invalid user role in response:", user);
      return {
        success: false,
        error: "Signup failed: Invalid user data",
      };
    }

    cookieStore.set("userRole", userRole, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_MAX_AGE,
      path: "/",
    });

    cookieStore.set("user_email", user.email_address, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_MAX_AGE,
      path: "/"
    });

    console.log("[completeSignup SERVER] Success, cookies set");

    return {
      success: true,
      error: null,
      isVerified: !!user?.isVerified,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("completeSignup -> error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Verification or registration failed. Please try again.",
      };
    }

    console.error("completeSignup -> unknown error:", error);
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    };
  }
}

// ----------------------
// RESEND OTP
// ----------------------

export async function resendOtp(
  email: string,
  role: "client" | "worker"
): Promise<{ success: boolean; error: string | null }> {
  try {
    await authApi.sendOtp({
      email_address: email,
      role,
    });

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("resendOtp -> error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data?.message || "Failed to resend OTP",
      };
    }

    console.error("resendOtp -> unknown error:", error);
    return { success: false, error: "Network error occurred" };
  }
}