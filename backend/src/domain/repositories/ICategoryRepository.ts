import { Category } from "../entities/Category";

export interface ICategoryRepository {
  create(category: Category): Promise<Category>;
  findAll(options?: {
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
  findBySlug(slug: string): Promise<Category | null>;
  findByIds(ids: string[]): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  update(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      isActive: boolean;
    }>
  ): Promise<Category>;
}

