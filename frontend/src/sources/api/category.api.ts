import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { Category, CategoryInput } from "@/shared/types/categoryTypes";
import { ADMIN_ROUTES, USER_ROUTES } from "@/sources/constant-api";

export async function fetchAllCategories(): Promise<Category[]> {
    const res = await axiosInstance.get<ApiResponse<Category[]>>(USER_ROUTES.CATEGORIES);
    if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch categories");
    }
    return res.data.payload;
}

export async function createCategory(data: CategoryInput): Promise<Category> {
    const res = await axiosInstance.post<ApiResponse<Category>>(ADMIN_ROUTES.CATEGORIES, data);
    if (!res.data.success) {
        throw new Error(res.data.message || "Failed to create category");
    }
    return res.data.payload;
}

export async function updateCategory(id: string, data: Partial<CategoryInput>): Promise<Category> {
    const res = await axiosInstance.put<ApiResponse<Category>>(ADMIN_ROUTES.CATEGORY_BY_ID(id), data);
    if (!res.data.success) {
        throw new Error(res.data.message || "Failed to update category");
    }
    return res.data.payload;
}

export async function toggleCategoryStatus(id: string): Promise<Category> {
    const res = await axiosInstance.patch<ApiResponse<Category>>(ADMIN_ROUTES.TOGGLE_CATEGORY(id));
    if (!res.data.success) {
        throw new Error(res.data.message || "Failed to toggle category status");
    }
    return res.data.payload;
}