"use server";

import axiosInstance from "@/lib/axiosInstance";
import { VerificationStatus } from "@/shared/enums/authEnums";
import { mapUserFromApi, RawUserApiData } from "@/shared/mappers/user.mapper";
import { ApiResponse } from "@/shared/types/responseTypes";
import { User, UserQueryParams } from "@/shared/types/userTypes";
import { ADMIN_ROUTES } from "@/sources/constant-api";

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

  rating?: number;
  totalRatings?: number;
  weeklyJobCount?: number;
  currentActiveRequestId?: string;
};


/* ---------------- HELPERS ---------------- */

function normalizeVerification(value: unknown): VerificationStatus {
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
    const res = await axiosInstance.get<ApiResponse<RawUserApiData[]>>(
      ADMIN_ROUTES.CLIENTS
    );

    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch clients");
    }

    return res.data.payload.map((u) => ({
      ...u,
      isVerified: normalizeVerification(
        u.isVerified ?? u.is_verified ?? u.verified
      ),
    })) as unknown as Client[];
  } catch (error: unknown) {
    const msg = error && typeof error === 'object' && 'normalizedMessage' in error ? String((error as { normalizedMessage: unknown }).normalizedMessage) : "Failed to fetch clients";
    throw new Error(msg);
  }
}

export async function fetchAllWorkers(): Promise<Worker[]> {
  try {
    const res = await axiosInstance.get<ApiResponse<RawUserApiData[]>>(
      ADMIN_ROUTES.WORKERS
    );

    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch workers");
    }

    return res.data.payload.map((u) => ({
      ...u,
      isVerified: normalizeVerification(
        u.isVerified ?? u.is_verified ?? u.verified
      ),
    })) as unknown as Worker[];
  } catch (error: unknown) {
    const msg = error && typeof error === 'object' && 'normalizedMessage' in error ? String((error as { normalizedMessage: unknown }).normalizedMessage) : "Failed to fetch workers";
    throw new Error(msg);
  }
}

// Helper to build query string
function buildQueryString(params: UserQueryParams): string {
  const query = new URLSearchParams();

  if (params.isBlocked !== undefined) {
    query.append("isBlocked", String(params.isBlocked));
  }
  if (params.isVerified) {
    query.append("isVerified", params.isVerified);
  }
  if (params.search) {
    query.append("search", params.search);
  }
  if (params.sortBy) {
    query.append("sortBy", params.sortBy);
  }
  if (params.sortOrder) {
    query.append("sortOrder", params.sortOrder);
  }
  if (params.page) {
    query.append("page", String(params.page));
  }
  if (params.limit) {
    query.append("limit", String(params.limit));
  }

  return query.toString();
}

export async function fetchAllUsers(
  params: UserQueryParams = {}
): Promise<{ users: User[]; total: number; totalPages: number }> {
  const queryString = buildQueryString(params);
  const url = `${ADMIN_ROUTES.USERS}${queryString ? `?${queryString}` : ""}`;

  const res = await axiosInstance.get<ApiResponse<{ users?: RawUserApiData[]; total?: number; totalPages?: number } | RawUserApiData[]>>(url);

  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to fetch users");
  }

  // Handle both array response (legacy) and paginated response
  if (Array.isArray(res.data.payload)) {
    return {
      users: (res.data.payload as RawUserApiData[]).map(mapUserFromApi),
      total: res.data.payload.length,
      totalPages: 1,
    };
  } else {
    const payload = res.data.payload as { users?: RawUserApiData[]; total?: number; totalPages?: number } | null;
    return {
      users: (payload?.users || []).map(mapUserFromApi),
      total: payload?.total || 0,
      totalPages: payload?.totalPages || 1,
    };
  }
}

export async function approveVerification(userId: string): Promise<void> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    ADMIN_ROUTES.VERIFY(userId)
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "Approval failed");
  }
}

export async function rejectVerification(
  userId: string,
  reason: string
): Promise<void> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    ADMIN_ROUTES.REJECT(userId),
    { reason }
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "Rejection failed");
  }
}

export async function toggleUserAccess(userId: string): Promise<User> {
  const res = await axiosInstance.patch<ApiResponse<RawUserApiData>>(
    ADMIN_ROUTES.ACCESS(userId)
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to toggle user access");
  }
  return mapUserFromApi(res.data.payload);
}
