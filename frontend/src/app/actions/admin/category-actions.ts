"use server";

import {
    fetchAllCategories,
    createCategory,
    updateCategory,
    toggleCategoryStatus,
} from "@/sources/api/category/category.api";
import { Category, CategoryInput } from "@/shared/types/categoryTypes";
import { ApiResponse } from "@/shared/types/responseTypes";

export async function getAllCategoriesAction(params?: {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}): Promise<ApiResponse<{
    categories: Category[];
    total: number;
    activeCount: number;
    inactiveCount: number;
}>> {
    try {
        const payload = await fetchAllCategories(params);

        return {
            success: true,
            message: "Categories fetched successfully",
            payload: payload,
        };
    } catch (error: any) {
        console.error("Fetch Categories Action Error:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to fetch categories";
        return {
            success: false,
            message: String(errorMessage),
            error: null,
        };
    }
}

export async function createCategoryAction(
    data: CategoryInput
): Promise<ApiResponse<Category>> {
    try {
        const category = await createCategory(data);

        return {
            success: true,
            message: "Category created successfully",
            payload: category,
        };
    } catch (error: any) {
        console.error("Create Category Action Error:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to create category";
        return {
            success: false,
            message: String(errorMessage),
            error: null,
        };
    }
}


export async function updateCategoryAction(
    id: string,
    data: Partial<CategoryInput>
): Promise<ApiResponse<Category>> {
    try {
        const category = await updateCategory(id, data);

        return {
            success: true,
            message: "Category updated successfully",
            payload: category,
        };
    } catch (error: any) {
        console.error("Update Category Action Error:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to update category";
        return {
            success: false,
            message: String(errorMessage),
            error: null,
        };
    }
}

export async function toggleCategoryStatusAction(
    id: string
): Promise<ApiResponse<Category>> {
    try {
        const category = await toggleCategoryStatus(id);

        return {
            success: true,
            message: "Category status updated",
            payload: category,
        };
    } catch (error: any) {
        console.error("Toggle Category Status Action Error:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to update category status";
        return {
            success: false,
            message: String(errorMessage),
            error: null,
        };
    }
}

