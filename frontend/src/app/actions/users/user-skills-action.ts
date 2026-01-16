"use server";

import userApi from "@/services/api/user.api";
import { ApiResponse } from "@/shared/types/responseTypes";
import { User } from "@/shared/types/userTypes";

export async function updateUserSkillsAction(
    userId: string,
    skills: string[]
): Promise<ApiResponse<User>> {
    try {
        console.log("update skills acalled ---------------==-------------------------------------------==================================")
        return await userApi.updateSkills(userId, skills);
    } catch (error: any) {
        console.log(":---------------------------------------------------------------------------------")
        throw new Error(
            error?.normalizedMessage || "Failed to update skills"
        );
    }
}