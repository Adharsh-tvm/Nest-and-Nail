

import axiosInstance from "@/lib/axiosInstance";
import { Address } from "@/shared/types/addressType";
import { ApiResponse } from "@/shared/types/responseTypes";
import { User } from "@/shared/types/userTypes";


export type UpdateRolePayload = {
  user: any;
  accessToken: string;
  refreshToken: string;
};

const userApi = {

  updateUserMode: async (
    role: "client" | "worker"
  ): Promise<ApiResponse<UpdateRolePayload>> => {
    const response = await axiosInstance.patch<ApiResponse<UpdateRolePayload>>(
      "/api/auth/mode",
      { role },
      { withCredentials: true }
    );
    return response.data;
  },

  getCurrentUserByEmail: async (
    email: string
  ): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get<ApiResponse<any>>(
      `/api/auth/current/${encodeURIComponent(email)}`,
      { withCredentials: true }
    );

    return response.data;
  },


  updateSkills: async (
    userId: string,
    skills: string[]
  ): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.put<ApiResponse<User>>(
      `/api/users/${userId}/skills`,
      { skills },
      { withCredentials: true }
    );
    return response.data;
  },

  addUserAddressApi: async (
    userId: string,
    payload: Address
  ): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.post(
      `/api/users/${userId}/address`,
      payload
    );
    return response.data
  }
};

export default userApi;
