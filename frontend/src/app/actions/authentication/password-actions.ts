"use server";

import authApi from "@/sources/api/user/auth.api";
import axios from "axios";

export async function changePasswordAction(payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}) {
    try {
        const response = await authApi.changePassword(payload);
        return {
            success: true,
            message: response.data.message || "Password changed successfully",
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                error: error.response?.data?.message || "Failed to change password"
            };
        }
        return {
            success: false,
            error: "An unexpected error occurred",
        };
    }
}
