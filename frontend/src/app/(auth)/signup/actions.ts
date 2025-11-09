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

export async function signup(
  prevState: SignupResponse,
  formData: FormData
): Promise<SignupResponse> {
  // Extract form data
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const role = formData.get("role") as "client" | "worker";

  // Preserve fields for validation errors
  const fields = { name, email, role };

  // Client-side validation
  if (!name || !email || !password || !confirmPassword) {
    return {
      error: "All fields are required",
      fields,
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match",
      fields,
    };
  }

  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters long",
      fields,
    };
  }

  // Email validation
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

    const endpoint = `${apiUrl}/api/client/register`;
    console.log("Calling API endpoint:", endpoint);

    // Call your backend API
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: name,
        email_address: email,
        password: password,
        user_role: role.toUpperCase(), // Convert to uppercase (CLIENT/WORKER)
      }),
      credentials: "include", // Important: allows cookies to be set
      cache: "no-store",
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    // Check content type before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Non-JSON response received:", contentType);
      const text = await response.text();
      console.error("Response body:", text.substring(0, 500));
      
      return {
        error: "Server error: Invalid response format. Please check your backend API.",
        fields,
      };
    }

    const data = await response.json();
    console.log("Response data received:", { 
      hasUser: !!data.user, 
      hasAccessToken: !!data.accessToken,
      hasRefreshToken: !!data.refreshToken 
    });

    if (!response.ok) {
      return {
        error: data.message || data.error || "Signup failed. Please try again.",
        fields,
      };
    }

    // Backend returns tokens in response
    // Set them in Next.js cookies
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
    } else {
      console.error("❌ No access token in response");
      return {
        error: "Signup failed: No access token received",
        fields,
      };
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
    
    // Extract role from JWT token to determine redirect
    const userRole = data.user?.user_role?.toLowerCase();
    
    if (!userRole) {
      console.error("❌ No user role found in response");
      return {
        error: "Signup failed: Invalid user data",
        fields,
      };
    }

    console.log(`🚀 Signup successful, redirecting to: /${userRole}/home`);

  } catch (error) {
    console.error("Signup error:", error);
    
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

  // Redirect based on role from cookie
  const cookieStore = await cookies();
  const userRole = cookieStore.get("userRole")?.value;

  if (userRole === "worker") {
    redirect("/worker/home");
  } else {
    redirect("/client/home");
  }
}