"use server";

import { cookies } from "next/headers";

export async function changeRoleAction(role: "client" | "worker") {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/mode`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    body: JSON.stringify({ role }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to switch role");
  }

  const data = await response.json();

  const { user, accessToken: newAccess, refreshToken: newRefresh } = data;

  // Clear old cookies
  cookieStore.set("accessToken", "", { maxAge: 0 });
  cookieStore.set("refreshToken", "", { maxAge: 0 });

  // Set new cookies
  cookieStore.set("accessToken", newAccess, {
    httpOnly: true,
    path: "/",
  });

  cookieStore.set("refreshToken", newRefresh, {
    httpOnly: true,
    path: "/",
  });

  return user;
}
