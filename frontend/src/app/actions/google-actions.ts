"use server";

import authApi from "@/services/auth/auth.api";
import { OAuth2Client } from "google-auth-library";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

type GoogleAuthState =
  | {
    success: boolean;
    message: string;
    user?: any; //need to check the right shape for user
  }
  | undefined;

export async function handleGoogleSignIn(
  googleToken: string,
  role: string,
): Promise<GoogleAuthState> {
  try {

    // console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, "hiuoihuihsdlfihgolighu")
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.name) {
      return { success: false, message: "Invalid Google token." };
    }

    const { email, name, picture } = payload;

    // 2. Call your backend's new 'google-auth' endpoint

    const response = await authApi.googleAuth({
      email,
      name,
      role
    });

    console.log("Google action response: ccccccccccc : ", response.data)

    if (!response.data.success) {
      return { success: false, message: response.data.message };
    }

    if (response.data.payload) {

      const { user, refreshToken, accessToken } = response.data.payload;


      // create cookies
      const cookieStore = await cookies();

      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/"
      });


      cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60,
        path: "/"
      });

      cookieStore.set("userRole", user.user_role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
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