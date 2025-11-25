"use server";

import authApi from "@/services/auth/auth.api";
import { AxiosError } from "axios";

type OtpResponse = {
  success: boolean;
  error: string | null;
  message?: string;
};

export async function sendOtp(email: string): Promise<OtpResponse> {
  try {
    const response = await authApi.sendOtp({
      email_address:email
      
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
      email_address:email,
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