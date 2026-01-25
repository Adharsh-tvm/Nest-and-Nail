import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IUpdateCategoryStatusUseCase } from "../../interfaces/IUpdateCategoryStatusUseCase";

export class UpdateCategoryStatusUseCase implements IUpdateCategoryStatusUseCase{
    constructor(private readonly categoryRepo: ICategoryRepository) { }

    async execute(categoryId: string, isActive: boolean) {
        await this.categoryRepo.updateStatus(categoryId, isActive);
    }
}
