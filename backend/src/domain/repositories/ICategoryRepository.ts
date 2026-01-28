import { Category } from "../entities/Category";

export interface ICategoryRepository {
  create(category: Category): Promise<Category>;
  findAll(): Promise<Category[]>;
  findBySlug(slug: string): Promise<Category | null>;
  update(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      isActive: boolean;
    }>
  ): Promise<Category>;
}

