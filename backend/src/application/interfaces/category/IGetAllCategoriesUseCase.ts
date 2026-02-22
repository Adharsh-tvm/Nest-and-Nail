import { Category } from "../../../domain/entities/Category";

export interface IGetAllCategoriesUseCase {
    execute(): Promise<Category[]>;
}
