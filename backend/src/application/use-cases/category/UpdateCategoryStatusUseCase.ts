import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IUpdateCategoryStatusUseCase } from "../../interfaces/category/IUpdateCategoryStatusUseCase";

export class UpdateCategoryStatusUseCase implements IUpdateCategoryStatusUseCase {

  constructor(private readonly _categoryRepo: ICategoryRepository) { }

  async execute(id: string, isActive: boolean) {

    const category = await this._categoryRepo.update(id, { isActive });

    if (!category) {
      throw new Error("Category not found");
    }

    return this._categoryRepo.update(id, { isActive });
  }
}
