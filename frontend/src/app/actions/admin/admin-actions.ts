"use server";

import {
  fetchAllClients,
  fetchAllWorkers,
  approveVerification,
  rejectVerification,
  toggleUserAccess,
  fetchAllUsers,
} from "@/services/api/admin.api";
import { User } from "@/shared/types/userTypes";


export async function getAllClientsAction() {
  return await fetchAllClients();
}

export async function getAllWorkersAction() {
  return await fetchAllWorkers();
}

export async function approveUserAction(userId: string) {
  return await approveVerification(userId);
}

export async function rejectUserAction(userId: string) {
  return await rejectVerification(userId);
}

export async function toggleUserAccessAction(
  userId: string
): Promise<User> {
  return await toggleUserAccess(userId);
}

export async function getAllUsers() {
  return await fetchAllUsers();
}