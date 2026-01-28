import { Category } from "../../domain/entities/Category";

export interface IUpdateCategoryUseCase {
  execute(
    id: string,
    data: {
      name: string;
      slug: string;
      isActive: boolean;
    }
  ): Promise<Category>;
}