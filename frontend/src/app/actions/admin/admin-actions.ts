"use server";

import {
  fetchAllClients,
  fetchAllWorkers,
  approveVerification,
  rejectVerification,
  toggleUserAccess,
  fetchAllUsers,
  fetchAllAdminConcerns,
  fetchAdminDashboardData,
} from "@/sources/api/admin/admin.api";
import { User, UserQueryParams } from "@/shared/types/userTypes";


export async function getAllClientsAction() {
  return await fetchAllClients();
}

export async function getAllWorkersAction() {
  return await fetchAllWorkers();
}

export async function approveUserAction(userId: string) {
  return await approveVerification(userId);
}

export async function rejectUserAction(userId: string, reason: string) {
  return await rejectVerification(userId, reason);
}

export async function toggleUserAccessAction(
  userId: string
): Promise<User> {
  return await toggleUserAccess(userId);
}

export async function getAllUsers(params: UserQueryParams = {}) {
  return await fetchAllUsers(params);
}

export async function getUserWalletBalanceByAdminAction(userId: string) {
  try {
    const { fetchUserWalletBalanceByAdmin } = await import("@/sources/api/admin/admin.api");
    const res = await fetchUserWalletBalanceByAdmin(userId);
    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllConcernsAction(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const res = await fetchAllAdminConcerns(params);
    return { success: true, payload: res };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAdminDashboardDataAction() {
  try {
    const res = await fetchAdminDashboardData();
    return { success: true, payload: res };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}