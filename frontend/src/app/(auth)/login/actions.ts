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

export async function login(
  prevState: LoginResponse,
  formData: FormData
): Promise<LoginResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const fields = { email };

  // Validation
  if (!email || !password) {
    return {
      error: "All fields are required",
      fields,
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      error: "Please enter a valid email address",
      fields,
    };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error("API URL not configured");
      return {
        error: "Server configuration error. Please contact support.",
        fields,
      };
    }

    const endpoint = `${apiUrl}/api/client/login`;
    console.log("Calling login endpoint:", endpoint);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        password: password,
      }),
      credentials: "include",
      cache: "no-store",
    });

    console.log("Login response status:", response.status);

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Non-JSON response received:", contentType);
      const text = await response.text();
      console.error("Response body:", text.substring(0, 500));

      return {
        error: "Server error: Invalid response format.",
        fields,
      };
    }

    const data = await response.json();
    console.log("Login response data:", {
      hasUser: !!data.user,
      hasAccessToken: !!data.accessToken,
      hasRefreshToken: !!data.refreshToken
    });

    if (!response.ok) {
      return {
        error: data.message || "Login failed. Please check your credentials.",
        fields,
      };
    }

    // IMPORTANT: Backend returns tokens in response
    // We need to manually set them in Next.js cookies
    const cookieStore = await cookies();

    if (data.accessToken) {
      cookieStore.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60, // 15 minutes
        path: "/",
      });
      console.log("✅ Access token cookie set");
    }

    if (data.refreshToken) {
      cookieStore.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });
      console.log("✅ Refresh token cookie set");
    }

    const userRole = data.user?.user_role?.toLowerCase();

    if (userRole) {
      cookieStore.set("userRole", userRole, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      console.log(`✅ User role cookie set: ${userRole}`);
      console.log("🚀 Login successful, redirecting to:", `/${userRole}/home`);
    } else {
      console.error("❌ No user role found in response");
      return {
        error: "Login failed: Invalid user data",
        fields,
      };
    }

  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        error: "Cannot connect to server. Please check if the backend is running.",
        fields,
      };
    }

    return {
      error: "Network error. Please check your connection and try again.",
      fields,
    };
  }

  // Get the role from cookies to determine redirect
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