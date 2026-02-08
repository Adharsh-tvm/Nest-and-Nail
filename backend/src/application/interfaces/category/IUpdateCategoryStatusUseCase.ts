import { Category } from "../../../domain/entities/Category";

export interface IUpdateCategoryStatusUseCase {
  execute(id: string): Promise<Category>;
}