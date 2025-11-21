"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AxiosError } from "axios";
import authApi from "@/services/auth/auth.api";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginResponse = {
  error: string | null;
  fields?: Partial<LoginFormData>;
};

export async function login(
  prevState: LoginResponse,
  formData: FormData
): Promise<LoginResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fields = { email };

  // Basic validation
  if (!email || !password) {
    return {
      error: "All fields are required",
      fields
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      error: "Please enter a valid email address",
      fields
    };
  }

  try {
    // Step 1: Call login endpoint
    const response = await authApi.login({
      email_address:email,
      password
    })

    const data = response.data;

    // Step 2: Validate we got tokens
    if (!data.accessToken) {
      return {
        error: "Login failed: No access token received",
        fields
      };
    }

    // ===== NEW: Verify token works before setting cookies =====
    try {
      console.log("Verifying token by calling /me endpoint...");
      const verifyResponse = await authApi.getMe()

      if (!verifyResponse.data?.user) {
        return {
          error: "Failed to retrieve user information. Please try again.",
          fields
        };
      }

      console.log("Token verified successfully");
    } catch (verifyError) {
      console.error("Token verification failed:", verifyError);
      return {
        error: "Token validation failed. Please try logging in again.",
        fields
      };
    }
    // ===== END NEW CODE =====

    // Step 3: Set cookies (only if verification passed)
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

    // Step 4: Redirect based on role
    if (userRole === "worker") {
      redirect("/worker/portal");
    } else if (userRole === "admin") {
      redirect("/admin/dashboard");
    } else {
      redirect("/client/home");
    }

  } catch (error) {
    // Existing error handling...
    if (error instanceof AxiosError) {
      if (error.response) {
        const data = error.response.data;
        return {
          error: data.message || "Login failed. Please check your credentials.",
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