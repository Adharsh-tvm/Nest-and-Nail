"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AxiosError } from "axios";
import axiosInstance from "@/lib/axiosInstance";

type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "client" | "worker";
};

type SignupResponse = {
  error: string | null;
  fields?: Partial<SignupFormData>;
  otpSent?: boolean; // New field to trigger OTP modal
};

// Step 1: Initiate signup by sending OTP (user NOT registered yet)
export async function signup(
  prevState: SignupResponse,
  formData: FormData
): Promise<SignupResponse> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const role = formData.get("role") as "client" | "worker";

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
    // Send OTP to email (user not registered yet)
    const response = await axiosInstance.post("/api/auth/send-otp", {
      email_address: email,
      role: role,       // ⬅️ ADD THIS
    });


    // OTP sent successfully - return success to trigger modal
    return {
      error: null,
      otpSent: true,
      fields
    };

  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        const data = error.response.data;
        return {
          error: data.message || data.error || "Failed to send OTP. Please try again.",
          fields
        };
      }

      if (error.code === "ECONNREFUSED" || error.message.includes("Network Error")) {
        return {
          error: "Cannot connect to server. Please check if the backend is running.",
          fields
        };
      }
    }

    return {
      error: "Network error. Please check your connection and try again.",
      fields
    };
  }
}

// Step 2: Complete signup after OTP verification
type CompleteSignupData = {
  name: string;
  email: string;
  password: string;
  role: "client" | "worker";
  otp: string;
  
};

type CompleteSignupResponse = {
  success: boolean;
  error: string | null;
  isVerified?: boolean;
};


export async function completeSignup(
  data: CompleteSignupData
): Promise<CompleteSignupResponse> {
  try {
    // First verify the OTP
    const otpVerifyResponse = await axiosInstance.post("/api/auth/verify-otp", {
      email_address: data.email,
      otp: data.otp,
    });

    // Check if OTP verification was successful
    if (!otpVerifyResponse.data || otpVerifyResponse.status !== 200) {
      return {
        success: false,
        error: "Invalid or expired OTP",
      };
    }

    // OTP verified successfully - now register the user
    const registerResponse = await axiosInstance.post("/api/auth/register", {
      user_name: data.name,
      email_address: data.email,
      password: data.password,
      user_role: data.role
    });

    const registerData = registerResponse.data;

    // Extract tokens from response body
    const { accessToken, refreshToken, user } = registerData;

    if (!accessToken || !refreshToken) {
      return {
        success: false,
        error: "Signup failed: No tokens received",
      };
    }

    // Set cookies for authentication
    const cookieStore = await cookies();

    // Set access token cookie
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes in seconds
      path: "/",
    });

    // Set refresh token cookie
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    // Store user role for redirect
    const userRole = user?.user_role?.toLowerCase();
    if (!userRole) {
      return {
        success: false,
        error: "Signup failed: Invalid user data",
      };
    }

    cookieStore.set("userRole", userRole, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return {
      success: true,
      error: null,
    };

  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        const data = error.response.data;
        return {
          success: false,
          error: data.message || data.error || "Verification or registration failed. Please try again.",
        };
      }

      if (error.code === "ECONNREFUSED" || error.message.includes("Network Error")) {
        return {
          success: false,
          error: "Cannot connect to server. Please check if the backend is running.",
        };
      }
    }

    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    };
  }
}

// Helper function to resend OTP
export async function resendOtp(
  email: string,
  role: "client" | "worker"
): Promise<{ success: boolean; error: string | null }> {
  try {
    await axiosInstance.post("/api/auth/send-otp", {
      email_address: email,
      role: role,
    });

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return {
          success: false,
          error: error.response.data.message || "Failed to resend OTP",
        };
      }

      if (error.code === "ECONNREFUSED" || error.message.includes("Network Error")) {
        return {
          success: false,
          error: "Cannot connect to server",
        };
      }
    }

    return {
      success: false,
      error: "Network error occurred",
    };
  }
}
