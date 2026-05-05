import { Category } from "../../../domain/entities/Category";

export interface IGetAllCategoriesUseCase {
    execute(options?: {
        search?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }): Promise<{
        categories: Category[];
        total: number;
        activeCount: number;
        inactiveCount: number;
    }>;
}
