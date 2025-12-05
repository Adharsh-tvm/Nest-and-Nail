// place this where you previously had your server action
"use server";

import { cookies } from "next/headers";
import userApi from "@/services/auth/user.api";

export async function changeRoleAction(role: "client" | "worker") {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    // call userApi (pass token so backend can validate)
    const data = await userApi.updateUserMode(role, accessToken);

    const { user, accessToken: newAccess, refreshToken: newRefresh } = data;

    // Clear old cookies
    cookieStore.set("accessToken", "", { maxAge: 0 });
    cookieStore.set("refreshToken", "", { maxAge: 0 });

    // Set new cookies if provided
    if (newAccess) {
      cookieStore.set("accessToken", newAccess, {
        httpOnly: true,
        path: "/",
      });
    }

    if (newRefresh) {
      cookieStore.set("refreshToken", newRefresh, {
        httpOnly: true,
        path: "/",
      });
    }

    return user;
  } catch (err) {
    console.error("Error switching role:", err);
    throw new Error("Failed to switch role");
  }
}
