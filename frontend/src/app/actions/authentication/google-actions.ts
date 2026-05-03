"use server";

import authApi from "@/sources/api/user/auth.api";
import { OAuth2Client } from "google-auth-library";
import { cookies } from "next/headers";

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

type GoogleAuthState =
  | {
    success: boolean;
    message: string;
    user?: any;
  }
  | undefined;

export async function handleGoogleSignIn(
  googleToken: string,
  role: string,
): Promise<GoogleAuthState> {
  try {

    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.name) {
      return { success: false, message: "Invalid Google token." };
    }

    const { email, name, picture } = payload;


    const response = await authApi.googleAuth({
      email,
      name,
      role
    });


    if (!response.data.success) {
      return { success: false, message: response.data.message };
    }

    if (response.data.payload) {

      const { user, refreshToken, accessToken } = response.data.payload;

      const ACCESS_MAX_AGE = Number(process.env.MAX_AGE_ACCESS_TOKEN);
      const REFRESH_MAX_AGE = Number(process.env.MAX_AGE_REFRESH_TOKEN);

      // create cookies
      const cookieStore = await cookies();

      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: REFRESH_MAX_AGE,
        path: "/"
      });


      cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ACCESS_MAX_AGE,
        path: "/"
      });

      cookieStore.set("userRole", user.user_role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ACCESS_MAX_AGE,
        path: "/"
      });

      cookieStore.set("user_email", user.email_address, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ACCESS_MAX_AGE,
        path: "/"
      });

      return {
        success: true,
        message: response.data.message,
        user: user,
      };
    } else {
      throw new Error("User payload not recieved")
    }

  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "An unknown error occurred.",
    };
  }
}