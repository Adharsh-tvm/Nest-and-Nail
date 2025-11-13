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
};

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
    const response = await axiosInstance.post("/api/auth/register", {
      user_name: name,
      email_address: email,
      password: password,
      user_role: role
    });

    const data = response.data;

    // Extract tokens from response body
    const { accessToken, refreshToken, user } = data;

    if (!accessToken || !refreshToken) {
      return {
        error: "Signup failed: No tokens received",
        fields
      };
    }

    // Manually set cookies in Next.js
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
        error: "Signup failed: Invalid user data",
        fields
      };
    }

    cookieStore.set("userRole", userRole, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        const data = error.response.data;
        return {
          error: data.message || data.error || "Signup failed. Please try again.",
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

  // Redirect based on role
  const cookieStore = await cookies();
  const userRole = cookieStore.get("userRole")?.value;

  if (userRole === "worker") {
    redirect("/worker/home");
  } else {
    redirect("/client/home");
  }
}