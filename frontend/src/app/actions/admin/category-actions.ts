"use server";

import {
    fetchAllCategories,
    createCategory,
    updateCategory,
    toggleCategoryStatus,
} from "@/sources/api/category/category.api";
import { Category, CategoryInput } from "@/shared/types/categoryTypes";
import { ApiResponse } from "@/shared/types/responseTypes";
import axios from "axios";

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
    } catch (error: unknown) {
        console.error("Fetch Categories Action Error:", error);
        const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : (error instanceof Error ? error.message : undefined);
        return {
            success: false,
            message: String(errorMessage || "Failed to fetch categories"),
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
    } catch (error: unknown) {
        console.error("Create Category Action Error:", error);
        const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : (error instanceof Error ? error.message : undefined);
        return {
            success: false,
            message: String(errorMessage || "Failed to create category"),
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
    } catch (error: unknown) {
        console.error("Update Category Action Error:", error);
        const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : (error instanceof Error ? error.message : undefined);
        return {
            success: false,
            message: String(errorMessage || "Failed to update category"),
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
    } catch (error: unknown) {
        console.error("Toggle Category Status Action Error:", error);
        const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : (error instanceof Error ? error.message : undefined);
        return {
            success: false,
            message: String(errorMessage || "Failed to update category status"),
            error: null,
        };
    }
}

