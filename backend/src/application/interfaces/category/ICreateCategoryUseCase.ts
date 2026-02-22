import { Category } from "../../../domain/entities/Category";

export interface ICreateCategoryUseCase {
    execute(name: string): Promise<Category>;
}
