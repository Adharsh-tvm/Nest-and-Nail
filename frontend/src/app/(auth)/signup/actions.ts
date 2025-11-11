"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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

/**
 * Handles server-side signup submission.
 * Validates fields, communicates with backend,
 * sets authentication cookies, and redirects user
 * based on role after successful registration.
 *
 * @param prevState - Previous state from useActionState
 * @param formData - Submitted signup form data
 * @returns {Promise<SignupResponse>} - Error or redirect
 */
export async function signup(
  prevState: SignupResponse,
  formData: FormData
): Promise<SignupResponse> {
  // Extract form inputs
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const role = formData.get("role") as "client" | "worker";

  // Persist these fields when returning errors
  const fields = { name, email, role };

  // Basic field and password validation.
  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required", fields };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match", fields };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long", fields };
  }

  // Email format validation.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address", fields };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Ensures API URL is configured.
    if (!apiUrl) {
      return {
        error: "Server configuration error. Please contact support.",
        fields
      };
    }

    const endpoint = `${apiUrl}/api/auth/register`;

    // Sends signup request to backend.
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_name: name,
        email_address: email,
        password: password,
        user_role: role
      }),
      credentials: "include",
      cache: "no-store"
    });

    // Ensures backend returns valid JSON.
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {
        error: "Server error: Invalid response format. Please check your backend API.",
        fields
      };
    }

    const data = await response.json();

    // Handles API errors returned by backend.
    if (!response.ok) {
      return {
        error: data.message || data.error || "Signup failed. Please try again.",
        fields
      };
    }

    // Stores tokens received from backend.
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
        error: "Signup failed: No access token received",
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

    // Extracts user role from response for redirect.
    const userRole = data.user?.user_role?.toLowerCase();
    if (!userRole) {
      return {
        error: "Signup failed: Invalid user data",
        fields
      };
    }

  } catch (error) {
    // Handles backend connection failures.
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

  // Redirects user based on stored role.
  const cookieStore = await cookies();
  const userRole = cookieStore.get("userRole")?.value;

  if (userRole === "worker") {
    redirect("/worker/home");
  } else {
    redirect("/client/home");
  }
}
