"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function updateUserProfileAction(userId: string, updates: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const fd = new FormData();

  if (updates.name) fd.append("name", updates.name);
  if (updates.phone) fd.append("phone", updates.phone);
  if (updates.address) {
    fd.append(
      "address",
      typeof updates.address === "object"
        ? JSON.stringify(updates.address)
        : updates.address
    );
  }

  if (typeof updates.isOnline === "boolean") {
    fd.append("isOnline", String(updates.isOnline));
  }

  if (updates.profilePicture instanceof File) {
    fd.append("profilePicture", updates.profilePicture);
  }

  try {
    const res = await axios.put(
      `${BASE_URL}/api/auth/user/${userId}/profile`,
      fd,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      success: true,
      message: "Profile Updated successfully",
      user: res.data.user
    }

  } catch (err: any) {
    console.error("Profile update failed", err.response?.data || err);

    return {
      success: false,
      message: err.response?.data?.message || "Profile update failed"
    }
  }
}


export async function uploadDocumentAction(userId: string, file: File) {
  const token = (await cookies()).get("accessToken")?.value;

  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${BASE_URL}/api/upload/worker/${userId}/document`,
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

