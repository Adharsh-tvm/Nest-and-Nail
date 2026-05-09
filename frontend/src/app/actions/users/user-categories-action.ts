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
    } catch (error: unknown) {
        throw new Error(
            (error && typeof error === "object" && "normalizedMessage" in error ? (error as { normalizedMessage: string }).normalizedMessage : undefined) || "Failed to update categories"
        );
    }
}

export async function fetchCategoriesAction() {
    try {
        const { fetchAllCategories } = await import("@/sources/api/category/category.api");
        const res = await fetchAllCategories();
        return res.categories;
    } catch (error: unknown) {
        console.error("Fetch categories error:", error);
        return [];
    }
}

