import axiosInstance from "@/lib/axiosInstance";

export const updateUserMode = async (role: "client" | "worker") => {
  try {
    const response = await axiosInstance.patch("/api/auth/mode", { role });
    return response.data;
  } catch (error: any) {
    console.error("Error updating user role:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};