"use server"

import { cookies } from "next/headers";
import "server-only";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const email = cookieStore.get("user_email")?.value;

    if (!token || !email) return null;

    const res = await fetch(
      `${process.env.BACKEND_URL}/api/auth/current/${email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.user;

  } catch (err) {
    console.error("Failed to fetch current user:", err);
    return null;
  }
}
