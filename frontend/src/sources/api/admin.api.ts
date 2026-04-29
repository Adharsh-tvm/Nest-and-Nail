

import axiosInstance from "@/lib/axiosInstance";
import { VerificationStatus } from "@/shared/enums/authEnums";
import { mapUserFromApi } from "@/shared/mappers/user.mapper";
import { ApiResponse } from "@/shared/types/responseTypes";
import { User, UserQueryParams } from "@/shared/types/userTypes";
import { AdminServiceResponseDTO } from "@/shared/types/serviceTypes";

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
  const url = `/api/admin/users/all${queryString ? `?${queryString}` : ""}`;

  const res = await axiosInstance.get<ApiResponse<any>>(url);

  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to fetch users");
  }

  // Handle both array response (legacy) and paginated response
  if (Array.isArray(res.data.payload)) {
    return {
      users: res.data.payload.map(mapUserFromApi),
      total: res.data.payload.length,
      totalPages: 1,
    };
  } else {
    return {
      users: (res.data.payload.users || []).map(mapUserFromApi),
      total: res.data.payload.total || 0,
      totalPages: res.data.payload.totalPages || 1,
    };
  }
}

export async function approveVerification(userId: string): Promise<void> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    `/api/admin/verify/${userId}`
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
    `/api/admin/reject/${userId}`,
    { reason }
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

export async function fetchAllAdminServices(): Promise<AdminServiceResponseDTO[]> {
  try {
    const res = await axiosInstance.get<ApiResponse<AdminServiceResponseDTO[]>>("/api/admin/services");
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch admin services");
    }
    return res.data.payload;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch admin services");
  }
}

export async function fetchAdminServiceDetails(serviceId: string): Promise<AdminServiceResponseDTO> {
  try {
    const res = await axiosInstance.get<ApiResponse<AdminServiceResponseDTO>>(`/api/admin/services/${serviceId}`);
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch admin service details");
    }
    return res.data.payload;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch admin service details");
  }
}

export async function fetchAllAdminMeetings(): Promise<AdminServiceResponseDTO[]> {
  try {
    const res = await axiosInstance.get<ApiResponse<AdminServiceResponseDTO[]>>("/api/admin/meetings");
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch admin meetings");
    }
    return res.data.payload;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch admin meetings");
  }
}

export async function fetchAdminMeetingDetails(serviceId: string): Promise<AdminServiceResponseDTO> {
  try {
    const res = await axiosInstance.get<ApiResponse<AdminServiceResponseDTO>>(`/api/admin/meetings/${serviceId}`);
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch admin meeting details");
    }
    return res.data.payload;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch admin meeting details");
  }
}

export const fetchUserWalletBalanceByAdmin = async (userId: string) => {
  const response = await axiosInstance.get(`/api/wallet/admin/${userId}/balance`);
  return response.data?.payload ?? response.data;
};
