

import axiosInstance from "@/lib/axiosInstance";
import { Address } from "@/shared/types/addressType";
import { ApiResponse } from "@/shared/types/responseTypes";
import { User } from "@/shared/types/userTypes";
import { AUTH_ROUTES, USER_ROUTES } from "@/sources/constant-api";


export type UpdateRolePayload = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

const userApi = {

  updateUserMode: async (
    role: "client" | "worker"
  ): Promise<ApiResponse<UpdateRolePayload>> => {
    const response = await axiosInstance.patch<ApiResponse<UpdateRolePayload>>(
      AUTH_ROUTES.MODE,
      { role },
      { withCredentials: true }
    );
    return response.data;
  },

  getCurrentUserByEmail: async (
    email: string
  ): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get<ApiResponse<User>>(
      AUTH_ROUTES.CURRENT_USER(email),
      { withCredentials: true }
    );

    return response.data;
  },

  getOnlineWorkers: async (): Promise<ApiResponse<User[]>> => {
    const response = await axiosInstance.get<ApiResponse<User[]>>(
      USER_ROUTES.ONLINE_WORKERS,
      { withCredentials: true }
    );
    return response.data;
  },



  updateSkills: async (
    userId: string,
    skills: string[]
  ): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.patch<ApiResponse<User>>(
      USER_ROUTES.SKILLS(userId),
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
      USER_ROUTES.ADD_ADDRESS(userId),
      payload
    );
    return response.data
  },

  updateCategories: async (
    userId: string,
    categories: string[]
  ): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.patch<ApiResponse<User>>(
      USER_ROUTES.UPDATE_CATEGORIES(userId),
      { categoryIds: categories },
      { withCredentials: true }
    );
    return response.data;
  },



  editUserAddressApi: async (
    userId: string,
    addressId: string,
    payload: Address
  ): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.put<ApiResponse<User>>(
      USER_ROUTES.UPDATE_ADDRESS(userId, addressId),
      payload,
      { withCredentials: true }
    );
    return response.data;
  },

  deleteUserAddressApi: async (
    userId: string,
    addressId: string
  ): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.delete<ApiResponse<User>>(
      USER_ROUTES.DELETE_ADDRESS(userId, addressId),
      { withCredentials: true }
    );
    return response.data;
  }
};

export default userApi;
