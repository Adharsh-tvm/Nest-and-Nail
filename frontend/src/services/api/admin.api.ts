"use server";

import axios from "axios";
import { cookies } from "next/headers";

export type Client = {
  user_id: string;
  user_name: string; 
  email_address: string;
  phone?: string;
  user_role: string;  
  profileImageUrl?: string;
  isBlocked: boolean;
  isVerified: boolean;
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
  isVerified: boolean;
};

type ApiListResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

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
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const allCookies = cookieStore.getAll();
    if (allCookies.length > 0) {
      const cookieString = allCookies
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join("; ");
      axiosInstance.defaults.headers.common['Cookie'] = cookieString;
    }
  } catch (error) {
    console.error("Error reading cookies:", error);
  }

  return axiosInstance;
}

// Export individual async functions instead of an object
export async function getAllClients(): Promise<Client[]> {
  const axiosInstance = await createAuthAxios();
  const res = await axiosInstance.get<ApiListResponse<Client[]>>("/api/admin/clients");
  return res.data.data;
}

export async function getAllWorkers(): Promise<Worker[]> {
  const axiosInstance = await createAuthAxios();
  const res = await axiosInstance.get<ApiListResponse<Worker[]>>("/api/admin/workers");
  return res.data.data;
}