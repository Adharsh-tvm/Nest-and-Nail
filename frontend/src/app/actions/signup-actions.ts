// app/actions/signup-actions.ts
"use server";

import { cookies } from "next/headers";
import { AxiosError } from "axios";
import authApi from "@/services/api/auth.api";

import { SignupStartSchema } from "@/lib/validation/signup.schema";
import { CompleteSignupSchema } from "@/lib/validation/complete-signup.schema";
import { VerificationStatus } from "@/shared/enums/authEnums";

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
  errorId?: number;
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
  isVerified?: VerificationStatus;
};

// ----------------------
// STEP 1: START SIGNUP (SEND OTP)
// ----------------------

export async function signup(
  prevState: SignupResponse,
  formData: FormData
): Promise<SignupResponse> {

  const input = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    role: (formData.get("role") as "client" | "worker") || "client"
  };

  // ZOD VALIDATION
  const parsed = SignupStartSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || "Invalid input",
      errorId: Date.now(),
      fields: {
        name: input.name,
        email: input.email,
        role: input.role,
      },
    };
  }

  const data = parsed.data;

  try {
    await authApi.sendOtp({
      email_address: data.email,
      role: data.role,
    });

    return {
      error: null,
      otpSent: true,
      fields: {
        name: data.name,
        email: data.email,
        role: data.role,
      },
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to send OTP",
        errorId: Date.now(),
        fields: {
          name: data.name,
          email: data.email,
          role: data.role
        },
      };
    }

    return {
      error: "Network error",
      errorId: Date.now(),
      fields: {
        name: data.name,
        email: data.email,
        role: data.role
      },
    };
  }
}



// ----------------------
// STEP 2: COMPLETE SIGNUP AFTER OTP
// ----------------------

export async function completeSignup(
  data: CompleteSignupData
): Promise<CompleteSignupResponse> {

  // ZOD VALIDATION
  const parsed = CompleteSignupSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input",
    };
  }

  const validated = parsed.data;

  try {
    // Verify OTP
    const otpResponse = await authApi.verifyOtp({
      email_address: validated.email,
      otp: validated.otp,
    });

    if (!otpResponse?.data) {
      return { success: false, error: "Invalid or expired OTP" };
    }

    // Prepare backend payload
    const signupPayload = {
      user_name: validated.name,
      email_address: validated.email,
      password: validated.password,
      user_role: validated.role,
    };

    // Register user
    const registerResponse = await authApi.signup(signupPayload);
    const registerData = registerResponse?.data;

    if (!registerData) {
      return { success: false, error: "Signup failed: empty response" };
    }

    const { accessToken, refreshToken, user } = registerData;

    if (!accessToken || !refreshToken) {
      return {
        success: false,
        error: "Signup failed: No tokens received",
      };
    }

    // Set cookies
    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    cookieStore.set("userRole", validated.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    cookieStore.set("user_email", validated.email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return {
      success: true,
      error: null,
      isVerified: user?.isVerified ? VerificationStatus.VERIFIED : VerificationStatus.NOT_VERIFIED,
    };

  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Verification or registration failed",
      };
    }

    return {
      success: false,
      error: "Network error",
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

    return { success: true, error: null };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to resend OTP",
      };
    }

    return { success: false, error: "Network error occurred" };
  }
}
