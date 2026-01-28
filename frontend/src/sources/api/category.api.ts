import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { Category, CategoryInput } from "@/shared/types/categoryTypes";

export async function fetchAllCategories(): Promise<Category[]> {
    const res = await axiosInstance.get<ApiResponse<Category[]>>("/api/admin/categories");
    if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch categories");
    }
    return res.data.payload;
}

export async function createCategory(data: CategoryInput): Promise<Category> {
    const res = await axiosInstance.post<ApiResponse<Category>>("/api/admin/categories", data);
    if (!res.data.success) {
        throw new Error(res.data.message || "Failed to create category");
    }
    return res.data.payload;
}

export async function updateCategory(id: string, data: Partial<CategoryInput>): Promise<Category> {
    const res = await axiosInstance.put<ApiResponse<Category>>(`/api/admin/categories/${id}`, data);
    if (!res.data.success) {
        throw new Error(res.data.message || "Failed to update category");
    }
    return res.data.payload;
}

export async function toggleCategoryStatus(id: string): Promise<Category> {
    const res = await axiosInstance.patch<ApiResponse<Category>>(`/api/admin/categories/${id}/toggle-status`);
    if (!res.data.success) {
        throw new Error(res.data.message || "Failed to toggle category status");
    }
    return res.data.payload;
}