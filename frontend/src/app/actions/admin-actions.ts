"use server"

import axiosInstance from "@/lib/axiosInstance"

export async function getAllClients() {
    const res = await axiosInstance.get("/api/admin/clients");
    return res.data;
}

export async function getAllWorkers() {
    const res = await axiosInstance.get("/api/admin/workers");
    return res.data;
}

export async function getAllUsers() {
    const res = await axiosInstance.get("/api/auth/all");
    return res.data.users;
}

export async function toggleUserAccess(userId: string) {
    const res = await axiosInstance.patch(`/api/admin/access/${userId}`);
    return res.data;
}
