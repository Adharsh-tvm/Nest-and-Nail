

import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import { VerificationStatus } from "@/shared/enums/authEnums";
import { mapUserFromApi } from "@/shared/mappers/user.mapper";
import { ApiResponse } from "@/shared/types/responseTypes";
import { User, UserQueryParams } from "@/shared/types/userTypes";
import { AdminServiceResponseDTO } from "@/shared/types/serviceTypes";
import { ADMIN_ROUTES, WALLET_ROUTES } from "@/sources/constant-api";

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
    const res = await axiosInstance.get<ApiResponse<Record<string, unknown>[]>>(
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
    const msg = (error as { normalizedMessage?: string })?.normalizedMessage || (error instanceof Error ? error.message : "Failed to fetch clients");
    throw new Error(msg);
  }
}

export async function fetchAllWorkers(): Promise<Worker[]> {
  try {
    const res = await axiosInstance.get<ApiResponse<Record<string, unknown>[]>>(
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
    const msg = (error as { normalizedMessage?: string })?.normalizedMessage || (error instanceof Error ? error.message : "Failed to fetch workers");
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
  const url = `/api/admin/users/all${queryString ? `?${queryString}` : ""}`;

  const res = await axiosInstance.get<ApiResponse<unknown>>(url);

  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to fetch users");
  }

  // Handle both array response (legacy) and paginated response
  if (Array.isArray(res.data.payload)) {
    return {
      users: res.data.payload.map((raw) => mapUserFromApi(raw as Record<string, unknown>)),
      total: res.data.payload.length,
      totalPages: 1,
    };
  } else {
    const payload = res.data.payload as { users?: unknown[]; total?: number; totalPages?: number } | undefined;
    const usersArray = payload?.users || [];
    return {
      users: usersArray.map((raw) => mapUserFromApi(raw as Record<string, unknown>)),
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
  const res = await axiosInstance.patch<ApiResponse<unknown>>(
    ADMIN_ROUTES.ACCESS(userId)
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to toggle user access");
  }
  return mapUserFromApi(res.data.payload as Record<string, unknown>);
}

export async function fetchAllAdminServices(): Promise<AdminServiceResponseDTO[]> {
  try {
    const res = await axiosInstance.get<ApiResponse<AdminServiceResponseDTO[]>>(ADMIN_ROUTES.SERVICES);
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch admin services");
    }
    return res.data.payload;
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data?.message : (error instanceof Error ? error.message : undefined);
    throw new Error(message || "Failed to fetch admin services");
  }
}

export async function fetchAdminServiceDetails(serviceId: string): Promise<AdminServiceResponseDTO> {
  try {
    const res = await axiosInstance.get<ApiResponse<AdminServiceResponseDTO>>(ADMIN_ROUTES.SERVICE_DETAILS(serviceId));
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch admin service details");
    }
    return res.data.payload;
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data?.message : (error instanceof Error ? error.message : undefined);
    throw new Error(message || "Failed to fetch admin service details");
  }
}

export async function fetchAllAdminMeetings(): Promise<AdminServiceResponseDTO[]> {
  try {
    const res = await axiosInstance.get<ApiResponse<AdminServiceResponseDTO[]>>(ADMIN_ROUTES.MEETINGS);
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch admin meetings");
    }
    return res.data.payload;
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data?.message : (error instanceof Error ? error.message : undefined);
    throw new Error(message || "Failed to fetch admin meetings");
  }
}

export async function fetchAdminMeetingDetails(serviceId: string): Promise<AdminServiceResponseDTO> {
  try {
    const res = await axiosInstance.get<ApiResponse<AdminServiceResponseDTO>>(ADMIN_ROUTES.MEETING_DETAILS(serviceId));
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch admin meeting details");
    }
    return res.data.payload;
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data?.message : (error instanceof Error ? error.message : undefined);
    throw new Error(message || "Failed to fetch admin meeting details");
  }
}

export const fetchUserWalletBalanceByAdmin = async (userId: string) => {
  const response = await axiosInstance.get(WALLET_ROUTES.ADMIN_BALANCE(userId));
  return response.data?.payload ?? response.data;
};

export interface AdminConcern {
  _id: string;
  serviceId: string;
  userId: string;
  raisedBy: string;
  message: string;
  images?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  clientName?: string;
  clientEmail?: string;
  workerName?: string;
  workerEmail?: string;
  raisedByName?: string;
  raisedByEmail?: string;
  serviceName?: string;
  serviceDescription?: string;
  serviceScheduledDate?: string;
  serviceAmount?: number;
}

export async function fetchAllAdminConcerns(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ concerns: AdminConcern[]; total: number; totalPages: number }> {
  try {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.search) query.append("search", params.search);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const queryString = query.toString();
    const url = `${ADMIN_ROUTES.CONCERNS}${queryString ? `?${queryString}` : ""}`;

    const res = await axiosInstance.get<ApiResponse<{ concerns: AdminConcern[]; total: number; totalPages: number }>>(url);
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch concerns");
    }
    return res.data.payload;
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data?.message : (error instanceof Error ? error.message : undefined);
    throw new Error(message || "Failed to fetch concerns");
  }
}

export async function fetchAdminDashboardData(): Promise<unknown> {
  try {
    const res = await axiosInstance.get<ApiResponse<unknown>>(ADMIN_ROUTES.DASHBOARD);
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch dashboard data");
    }
    return res.data.payload;
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data?.message : (error instanceof Error ? error.message : undefined);
    throw new Error(message || "Failed to fetch dashboard data");
  }
}
