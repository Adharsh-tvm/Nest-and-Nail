"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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
      redirect("/worker");
    } else if (userRole === "admin") {
      redirect("/admin");
    } else {
      redirect("/client");
    }

}