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