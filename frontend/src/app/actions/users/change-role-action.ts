"use server";

import userApi from "@/sources/api/user/user.api";
import { cookies } from "next/headers";


export async function changeRoleAction(role: "client" | "worker") {
  const res = await userApi.updateUserMode(role);

  if (!res.success) {
    console.error("Error switching role:", res.message);
    throw new Error(res.message || "Failed to switch role");
  }

  const {
    user,
    accessToken: newAccess,
    refreshToken: newRefresh,
  } = res.payload;

  const cookieStore = await cookies();

  const ACCESS_MAX_AGE = Number(process.env.MAX_AGE_ACCESS_TOKEN);
  const REFRESH_MAX_AGE = Number(process.env.MAX_AGE_REFRESH_TOKEN);

  if (newAccess) {
    cookieStore.set("accessToken", newAccess, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_MAX_AGE,
    });
  }

  if (newRefresh) {
    cookieStore.set("refreshToken", newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_MAX_AGE,
    });
  }

  return user;
}
