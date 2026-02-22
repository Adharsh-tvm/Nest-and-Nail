"use server";

import authApi from "@/sources/api/auth.api";
import { AxiosError } from "axios";

type OtpResponse = {
  success: boolean;
  error: string | null;
  message?: string;
};

export async function sendOtp(email: string): Promise<OtpResponse> {
  try {
    const response = await authApi.sendOtp({
      email_address: email

    })

    return {
      success: true,
      error: null,
      message: response.data.message || "OTP sent successfully",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return {
          success: false,
          error: error.response.data.message || "Failed to send OTP",
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
      error: "Network error. Please try again.",
    };
  }
}

export async function verifyOtp(
  email: string,
  otp: string
): Promise<OtpResponse> {
  try {
    const response = await authApi.verifyOtp({
      email_address: email,
      otp
    })
    return {
      success: true,
      error: null,
      message: response.data.message || "OTP verified successfully",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return {
          success: false,
          error: error.response.data.message || "Invalid or expired OTP",
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
      error: "Network error. Please try again.",
    };
  }
}

export async function forgotPasswordAction(email_address: string) {
  try {
    const res = await authApi.forgotPassword({ email_address });

    return {
      success: true,
      message: res.data.message || "OTP sent successfully",
    };

  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Something went wrong while sending OTP",
    };
  }
}


export async function verifyResetOtpAction(
  email_address: string,
  otp: string
) {
  try {
    const response = await authApi.verifyOtp({ email_address, otp });

    const data = response.data;

    if (!data.success) {
      return {
        error: data.error || data.message || "Invalid or expired OTP",
      };
    }

    return { success: true };

  } catch (error: any) {
    return {
      error:
        error.response?.data?.message ||
        "Unable to verify OTP. Please try again.",
    };
  }
}

export async function resetPasswordAction(
  email_address: string,
  newPassword: string,
  confirmPassword: string
) {
  try {
    const response = await authApi.resetPassword({
      email_address,
      newPassword,
      confirmPassword,
    });

    return {
      success: response.data.message || "Password reset successful",
    };
  } catch (error: any) {
    return {
      error:
        error.response?.data?.message ||
        "Failed to reset password",
    };
  }
}