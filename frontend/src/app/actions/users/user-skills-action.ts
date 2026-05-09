"use server";

import userApi from "@/sources/api/user/user.api";
import { ApiResponse } from "@/shared/types/responseTypes";
import { User } from "@/shared/types/userTypes";

export async function updateUserSkillsAction(
    userId: string,
    skills: string[]
): Promise<ApiResponse<User>> {
    try {
        return await userApi.updateSkills(userId, skills);
    } catch (error: unknown) {
        throw new Error(
            (error && typeof error === "object" && "normalizedMessage" in error ? (error as { normalizedMessage: string }).normalizedMessage : undefined) || "Failed to update skills"
        );
    }
}