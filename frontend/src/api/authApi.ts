import axiosInstance from "@/lib/axiosInstance";

interface LoginCredentials {
  email_address: string;
  password: string;
}

interface User {
  user_id: string;
  user_name: string;
  email_address: string;
  phone_number: number;
  profileImageUrl: string;
  isBlocked: boolean;
  user_role: "CLIENT" | "WORKER" | "ADMIN";
}

interface LoginResponse {
  user: User;
  message?: string;
}


export const authApi = {
  
  login: (credentials: LoginCredentials) =>
    axiosInstance.post<LoginResponse>("/api/client/login", credentials),
  get: () =>
    axiosInstance.get<LoginResponse>("/api/client/me"),
  logout: () =>
    axiosInstance.post("api/client/logout")
}
export default authApi;