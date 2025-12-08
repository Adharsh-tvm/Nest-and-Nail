// app/services/adminUsers.api.ts (example path)
"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { VerificationStatus } from "@/enums/enums";

// ----------------------
// Domain Types
// ----------------------

export type Client = {
  user_id: string;
  user_name: string;
  email_address: string;
  phone?: string;
  user_role: string;
  profileImageUrl?: string;
  isBlocked: boolean;
  isVerified: VerificationStatus;
};

export type Worker = {
  user_id: string;
  user_name: string;
  email_address: string;
  phone?: string;
  user_role: string;
  skills: string[];
  profileImageUrl?: string;
  isBlocked: boolean;
  isVerified: VerificationStatus;
};

export interface User {
  user_id: string;
  user_name: string;
  email_address: string;
  phone_number?: number;
  user_role: string;
  profileImageUrl?: string;
  isBlocked: boolean;
  isVerified: "PENDING" | "NOT_VERIFIED" | "VERIFIED";

  // ⭐ ADD
  skills: string[];
  address?: string;
  documents: string[];
  certificates: string[];
  workPhotos: string[];
  createdAt: string;
  updatedAt: string;
}

// Raw API list wrapper
type ApiListResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

// ----------------------
// Helpers
// ----------------------

// Raw shapes coming from API (various formats of isVerified)
type ApiClient = Omit<Client, "isVerified"> & {
  isVerified?: any;
  is_verified?: any;
  verified?: any;
};

type ApiWorker = Omit<Worker, "isVerified"> & {
  isVerified?: any;
  is_verified?: any;
  verified?: any;
};

function normalizeVerification(value: any): VerificationStatus {
  if (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "VERIFIED" ||
    value === "verified"
  ) {
    return VerificationStatus.VERIFIED;
  }

  if (value === "PENDING" || value === "pending") {
    return VerificationStatus.PENDING;
  }

  return VerificationStatus.NOT_VERIFIED;
}

// Helper to create axios instance with cookies
async function createAuthAxios() {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (accessToken) {
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${accessToken}`;
    }

    const allCookies = cookieStore.getAll();
    if (allCookies.length > 0) {
      const cookieString = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");
      axiosInstance.defaults.headers.common["Cookie"] = cookieString;
    }
  } catch (error) {
    console.error("Error reading cookies:", error);
  }

  return axiosInstance;
}

// ----------------------
// API Functions
// ----------------------

export async function getAllClients(): Promise<Client[]> {
  const axiosInstance = await createAuthAxios();
  const res = await axiosInstance.get<ApiListResponse<ApiClient[]>>(
    "/api/admin/clients"
  );

  return res.data.data.map((u) => ({
    ...u,
    isVerified: normalizeVerification(
      u.isVerified ?? u.is_verified ?? u.verified
    ),
  }));
}

export async function getAllWorkers(): Promise<Worker[]> {
  const axiosInstance = await createAuthAxios();
  const res = await axiosInstance.get<ApiListResponse<ApiWorker[]>>(
    "/api/admin/workers"
  );

  return res.data.data.map((u) => ({
    ...u,
    isVerified: normalizeVerification(
      u.isVerified ?? u.is_verified ?? u.verified
    ),
  }));
}
