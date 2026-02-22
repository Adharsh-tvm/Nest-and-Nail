import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IUpdateCategoryStatusUseCase } from "../../interfaces/category/IUpdateCategoryStatusUseCase";

export class UpdateCategoryStatusUseCase implements IUpdateCategoryStatusUseCase {

  constructor(private readonly _categoryRepo: ICategoryRepository) { }

  async execute(id: string) {
    const category = await this._categoryRepo.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    const updated = await this._categoryRepo.update(id, {
      isActive: !category.isActive,
    });

    return updated;
  }



}
