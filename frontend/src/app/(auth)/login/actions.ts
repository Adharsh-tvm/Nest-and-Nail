"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginResponse = {
  error: string | null;
  fields?: Partial<LoginFormData>;
};

/**
 * Handles server-side login submission.
 * Validates input, calls backend and sets auth cookies.
 * Redirects user based on their role after success.
 *
 * @param prevState - Previous login state returned by useActionState
 * @param formData - Form data submitted from the login form
 * @returns {Promise<LoginResponse>} - Either an error or triggers a redirect
 */
export async function login(
  prevState: LoginResponse,
  formData: FormData
): Promise<LoginResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const fields = { email };

  // Basic validation for required fields.
  if (!email || !password) {
    return {
      error: "All fields are required",
      fields
    };
  }

  // Email format validation.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      error: "Please enter a valid email address",
      fields
    };
  }

  try {
    // Sends login request to backend using axios.
    const response = await axiosInstance.post("/api/auth/login", {
      email_address: email,
      password: password
    });

    const data = response.data;

    // Stores tokens in secure cookies.
    const cookieStore = await cookies();

    if (data.accessToken) {
      cookieStore.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60,
        path: "/"
      });
    } else {
      return {
        error: "Login failed: No access token received",
        fields
      };
    }

    if (data.refreshToken) {
      cookieStore.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/"
      });
    }

    // Store user role for redirect
    const userRole = data.user?.user_role?.toLowerCase();
    if (userRole) {
      cookieStore.set("userRole", userRole, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/"
      });
    }

  } catch (error) {
    // Handles axios errors
    if (error instanceof AxiosError) {
      // Backend returned an error response
      if (error.response) {
        const data = error.response.data;
        return {
          error: data.message || "Login failed. Please check your credentials.",
          fields
        };
      }
      
      // Network error or backend unreachable
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

  // Determines redirect based on stored user role.
  const cookieStore = await cookies();
  const userRole = cookieStore.get("userRole")?.value;

  if (userRole === "worker") {
    redirect("/worker/home");
  } else if (userRole === "admin") {
    redirect("/admin/dashboard");
  } else {
    redirect("/client/home");
  }
}