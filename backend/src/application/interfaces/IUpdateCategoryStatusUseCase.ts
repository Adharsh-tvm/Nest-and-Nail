import { Category } from "../../domain/entities/Category";

export interface IUpdateCategoryStatusUseCase {
  execute(id: string, isActive: boolean): Promise<Category>;
}