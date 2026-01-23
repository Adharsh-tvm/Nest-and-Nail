"use server";

import userApi from "@/sources/api/user.api";
import { Address } from "@/shared/types/addressType";
import { ApiResponse } from "@/shared/types/responseTypes";
import { User } from "@/shared/types/userTypes";
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


export async function addUSerAddressAction(
  userId: string,
  address: Address
): Promise<ApiResponse<User>> {
  try {
    return await userApi.addUserAddressApi(userId, address);
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add address",
      error: {
        status: error?.response?.status,
        data: error?.response?.data,
      },
    };
  }
}


export async function reverseGeocode(lat: number, lng: number) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  );

  if (!res.ok) {
    throw new Error("Failed to reverse geocode");
  }

  const data = await res.json();

  const address = data.address;

  return {
    street: address.road || "",
    city: address.city || address.town || address.village || "",
    state: address.state || "",
    country: address.country || "",
    zip: address.postcode || "",
  };
}


