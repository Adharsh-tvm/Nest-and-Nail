"use server";

import axiosInstance from "@/lib/axiosInstance";
import { VerificationStatus } from "@/shared/enums/authEnums"; 
import { User } from "@/shared/types/userTypes";

/* ---------------- TYPES ---------------- */

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

type ApiListResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

/* ---------------- HELPERS ---------------- */

function normalizeVerification(value: any): VerificationStatus {
  if (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "VERIFIED"
  ) {
    return VerificationStatus.VERIFIED;
  }

  if (value === "PENDING") {
    return VerificationStatus.PENDING;
  }

  return VerificationStatus.NOT_VERIFIED;
}

/* ---------------- API CALLS ---------------- */

export async function fetchAllClients(): Promise<Client[]> {
  try {
    const res = await axiosInstance.get<ApiListResponse<any[]>>(
      "/api/admin/clients"
    );

    return res.data.data.map((u) => ({
      ...u,
      isVerified: normalizeVerification(
        u.isVerified ?? u.is_verified ?? u.verified
      ),
    }));
  } catch (error: any) {
    throw new Error(error.normalizedMessage || "Failed to fetch clients");
  }
}

export async function fetchAllWorkers(): Promise<Worker[]> {
  try {
    const res = await axiosInstance.get<ApiListResponse<any[]>>(
      "/api/admin/workers"
    );

    return res.data.data.map((u) => ({
      ...u,
      isVerified: normalizeVerification(
        u.isVerified ?? u.is_verified ?? u.verified
      ),
    }));
  } catch (error: any) {
    throw new Error(error.normalizedMessage || "Failed to fetch workers");
  }
}

export async function fetchAllUsers(): Promise<User[]> {
  try {
    const res = await axiosInstance.get<ApiListResponse<any[]>>(
      "api/auth/all"
    );

    return res.data.data;
  } catch (error: any) {
    throw new Error(error.normalizedMessage || "Failed to fetch users");
  }
}

export async function approveVerification(userId: string) {
  try {
    const res = await axiosInstance.patch(
      `/api/admin/verify/${userId}`
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error.normalizedMessage || "Approval failed");
  }
}

export async function rejectVerification(userId: string) {
  try {
    const res = await axiosInstance.patch(
      `/api/admin/reject/${userId}`
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error.normalizedMessage || "Rejection failed");
  }
}

// services/admin/admin.api.ts
export async function toggleUserAccess(userId: string) {
  try {
    const res = await axiosInstance.patch(
      `/api/admin/access/${userId}`
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.normalizedMessage || "Failed to toggle user access"
    );
  }
}
