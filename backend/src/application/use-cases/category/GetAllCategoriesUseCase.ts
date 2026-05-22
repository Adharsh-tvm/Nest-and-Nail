import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IGetAllCategoriesUseCase } from "../../interfaces/category/IGetAllCategoriesUseCase";

export class GetAllCategoriesUseCase implements IGetAllCategoriesUseCase {
    constructor(private readonly _categoryRepo: ICategoryRepository) { }

    async execute(options?: {
        search?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }) {
        return await this._categoryRepo.findAll(options);
    }
}
