"use server";

import axiosInstance from "@/lib/axiosInstance";
import { VerificationStatus } from "@/shared/enums/authEnums";
import { mapUserFromApi } from "@/shared/mappers/user.mapper";
import { ApiResponse } from "@/shared/types/responseTypes";
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
    const res = await axiosInstance.get<ApiResponse<any[]>>(
      "/api/admin/clients"
    );

    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch clients");
    }

    return res.data.payload.map((u) => ({
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
    const res = await axiosInstance.get<ApiResponse<any[]>>(
      "/api/admin/workers"
    );

    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch workers");
    }

    return res.data.payload.map((u) => ({
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
  const res = await axiosInstance.get<ApiResponse<any[]>>(
    "/api/auth/all"
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to fetch users");
  }

  return res.data.payload.map(mapUserFromApi);
}

export async function approveVerification(userId: string): Promise<void> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    `/api/admin/verify/${userId}`
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "Approval failed");
  }
}

export async function rejectVerification(userId: string): Promise<void> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    `/api/admin/reject/${userId}`
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "Rejection failed");
  }
}

export async function toggleUserAccess(userId: string): Promise<User> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    `/api/admin/access/${userId}`
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to toggle user access");
  }
  return mapUserFromApi(res.data.payload);
}
