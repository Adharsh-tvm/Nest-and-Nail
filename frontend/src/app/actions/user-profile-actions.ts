"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 🟢 MAIN UNIVERSAL ACTION
export async function updateUserProfileAction(userId: string, updates: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  try {
    const res = await axios.put(
      `${BASE_URL}/api/auth/user/${userId}/profile`, // ✅ FIXED ROUTE
      updates,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;

  } catch (err: any) {
    console.error("Profile update failed", err.response?.data || err);
    throw new Error(err.response?.data?.message || "Profile update failed");
  }
}


export async function uploadDocumentAction(userId: string, file: File) {
  const token = (await cookies()).get("accessToken")?.value;

  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${BASE_URL}/api/upload/worker/${userId}/document`, // ✅ FIXED ROUTE
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.url;
}

