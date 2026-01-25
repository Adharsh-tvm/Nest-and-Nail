import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IGetAllCategoriesUseCase } from "../../interfaces/IGetAllCategoriesUseCase";

export class GetAllCategoriesUseCase implements IGetAllCategoriesUseCase{
    constructor(private readonly categoryRepo: ICategoryRepository) { }

    async execute() {
        return await this.categoryRepo.findAll();
    }
}
