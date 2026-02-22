"use server";

import {
    fetchAllCategories,
    createCategory,
    updateCategory,
    toggleCategoryStatus,
} from "@/sources/api/category.api";
import { Category, CategoryInput } from "@/shared/types/categoryTypes";
import { ApiResponse } from "@/shared/types/responseTypes";

export async function getAllCategoriesAction(): Promise<ApiResponse<Category[]>> {
    try {
        const categories = await fetchAllCategories();

        return {
            success: true,
            message: "Categories fetched successfully",
            payload: categories,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to fetch categories",
            error,
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
        return {
            success: false,
            message: error.message || "Failed to create category",
            error,
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
        return {
            success: false,
            message: error.message || "Failed to update category",
            error,
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
        return {
            success: false,
            message: error.message || "Failed to update category status",
            error,
        };
    }
}

