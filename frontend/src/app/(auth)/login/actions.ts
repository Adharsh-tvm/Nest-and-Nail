"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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
 */
export async function login(
  prevState: LoginResponse,
  formData: FormData
): Promise<LoginResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const fields = { email };

  /**
   * Basic validation for required fields.
   */
  if (!email || !password) {
    return {
      error: "All fields are required",
      fields
    };
  }

  /**
   * Email format validation.
   */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      error: "Please enter a valid email address",
      fields
    };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    /**
     * Ensures backend URL exists.
     */
    if (!apiUrl) {
      return {
        error: "Server configuration error. Please contact support.",
        fields
      };
    }

    const endpoint = `${apiUrl}/api/client/login`;

    /**
     * Sends login request to backend.
     */
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email_address: email,
        password: password
      }),
      credentials: "include",
      cache: "no-store"
    });

    /**
     * Ensures backend returns valid JSON.
     */
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {
        error: "Server error: Invalid response format.",
        fields
      };
    }

    const data = await response.json();

    /**
     * Returns error if backend rejects login.
     */
    if (!response.ok) {
      return {
        error: data.message || "Login failed. Please check your credentials.",
        fields
      };
    }

    /**
     * Stores tokens in secure cookies.
     */
    const cookieStore = await cookies();

    if (data.accessToken) {
      cookieStore.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60,
        path: "/"
      });
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

  } catch (error) {
    /**
     * Handles network or unreachable backend errors.
     */
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        error: "Cannot connect to server. Please check if the backend is running.",
        fields
      };
    }

    return {
      error: "Network error. Please check your connection and try again.",
      fields
    };
  }

  /**
   * Determines redirect based on stored user role.
   */
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
