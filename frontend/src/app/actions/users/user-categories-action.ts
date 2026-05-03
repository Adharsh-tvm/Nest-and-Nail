"use server";

import userApi from "@/sources/api/user/user.api";
import { ApiResponse } from "@/shared/types/responseTypes";
import { User } from "@/shared/types/userTypes";

export async function updateUserCategoriesAction(
    userId: string,
    categories: string[]
): Promise<ApiResponse<User>> {
    try {
        return await userApi.updateCategories(userId, categories);
    } catch (error: any) {
        throw new Error(
            error?.normalizedMessage || "Failed to update categories"
        );
    }
}

export async function fetchCategoriesAction() {
    try {
        const { fetchAllCategories } = await import("@/sources/api/category/category.api");
        return await fetchAllCategories();
    } catch (error: any) {
        console.error("Fetch categories error:", error);
        return [];
    }
}

