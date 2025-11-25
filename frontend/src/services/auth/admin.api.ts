import axiosInstance from "@/lib/axiosInstance";
import { AxiosResponse } from "axios";

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
  skills:string[];
  profileImageUrl?: string;
  isBlocked: boolean;
  isVerified: boolean;
};

type ApiListResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export const adminApi = {
  // returns Client[]
  getAllClients: async (): Promise<Client[]> => {
    const res: AxiosResponse<ApiListResponse<Client[]>> = await axiosInstance.get("/api/admin/clients");
    return res.data.data;
  },

  // returns Worker[] 
  getAllWorkers: async (): Promise<Worker[]> => {
    const res: AxiosResponse<ApiListResponse<Worker[]>> = await axiosInstance.get("/api/admin/workers");
    return res.data.data;
  }
};
