"use server";

import {
    fetchAllCategories,
    createCategory,
    updateCategory,
    toggleCategoryStatus,
} from "@/sources/api/category.api";
import { Category, CategoryInput } from "@/shared/types/categoryTypes";

export async function getAllCategoriesAction() {
    return await fetchAllCategories();
}

export async function createCategoryAction(data: CategoryInput) {
    return await createCategory(data);
}

export async function updateCategoryAction(id: string, data: Partial<CategoryInput>) {
    return await updateCategory(id, data);
}

export async function toggleCategoryStatusAction(id: string) {
    return await toggleCategoryStatus(id);
}

