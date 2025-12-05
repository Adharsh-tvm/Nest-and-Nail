// services/user/user.api.ts
import axiosInstance from "@/lib/axiosInstance";

export type UpdateRoleResponse = {
  user?: any;
  accessToken?: string;
  refreshToken?: string;
};

const userApi = {
  /**
   * Update user role/mode
   * @param role "client" | "worker"
   * @param token optional Bearer token; if provided it will be sent in Authorization header
   */
  updateUserMode: async (role: "client" | "worker", token?: string) => {
    try {
      const response = await axiosInstance.patch(
        "/api/auth/mode",
        { role },
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
          withCredentials: true,
        }
      );
      return response.data as UpdateRoleResponse;
    } catch (error: any) {
      console.error("Error updating user role:", error);
      throw error.response?.data || { message: "Something went wrong" };
    }
  },

  /**
   * Get current user by email
   * @param email user's email
   * @param token Bearer token (required)
   */
  getCurrentUserByEmail: async (email: string, token: string) => {
    try {
      const response = await axiosInstance.get(`/api/auth/current/${encodeURIComponent(email)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching current user:", error);
      throw error.response?.data || { message: "Something went wrong" };
    }
  },
};

export default userApi;
