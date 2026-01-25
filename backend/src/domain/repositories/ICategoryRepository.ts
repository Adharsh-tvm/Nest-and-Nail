import { Category } from "../entities/Category";

export interface ICategoryRepository {
  create(category: Category): Promise<Category>;
  findAll(): Promise<Category[]>;
  findBySlug(slug: string): Promise<Category | null>;
  updateStatus(id: string, isActive: boolean): Promise<void>;
}
