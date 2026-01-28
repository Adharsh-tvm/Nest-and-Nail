import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IGetAllCategoriesUseCase } from "../../interfaces/IGetAllCategoriesUseCase";

export class GetAllCategoriesUseCase implements IGetAllCategoriesUseCase{
    constructor(private readonly _categoryRepo: ICategoryRepository) { }

    async execute() {
        return await this._categoryRepo.findAll();
    }
}
