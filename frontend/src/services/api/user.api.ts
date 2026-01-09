// services/user/user.api.ts
import axiosInstance from "@/lib/axiosInstance";
import { SuccessResponse } from "@/shared/types/responseTypes";

export type UpdateRoleResponse = {
  user?: any;
  accessToken?: string;
  refreshToken?: string;
};



const userApi = {
  /**
   * Update user role/mode
   * @param role "client" | "worker"
   */
  updateUserMode: async (role: "client" | "worker"): Promise<SuccessResponse<UpdateRoleResponse>> => {
    try {
      const response = await axiosInstance.patch(
        "/api/auth/mode",
        { role },
        {
          withCredentials: true, // This sends cookies automatically
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating user role:", error);
      throw error.response?.data || { message: "Something went wrong" };
    }
  },

  /**
   * Get current user by email
   * @param email user's email
   */
  getCurrentUserByEmail: async (email: string) => {
    try {
      const response = await axiosInstance.get(
        `/api/auth/current/${encodeURIComponent(email)}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching current user:", error);
      throw error.response?.data || { message: "Something went wrong" };
    }
  },
};

export default userApi;