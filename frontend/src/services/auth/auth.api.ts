import { signup } from "@/app/actions/signup-actions";
import axiosInstance from "@/lib/axiosInstance";

export type LoginPayload = {
    email_address: string;
    password: string;
}

export const authApi = {
    login: (payload: LoginPayload) =>
        axiosInstance.post("/api/auth/login", payload),

    signup: (payload: any) =>
        axiosInstance.post("api/auth/signup", payload),

    refresh: () =>
        axiosInstance.post("/api/auth/refresh"),

    verfify: (payload: { token: string }) =>
        axiosInstance.post("api/auth/verify"),

    logout: () =>
        axiosInstance.post("api/auth/logout"),

    getMe: () =>
        axiosInstance.get("api/auth/me"),

    sendOtp: (payload: { email: string }) =>
        axiosInstance.post("/api/auth/otp/send", payload),

    verifyOtp: (payload: { email: string; otp: string }) =>
        axiosInstance.post("/api/auth/otp/verify", payload),
}

export default authApi;