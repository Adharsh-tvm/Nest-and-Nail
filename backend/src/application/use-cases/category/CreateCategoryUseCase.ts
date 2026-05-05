import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { Category } from "../../../domain/entities/Category";
import { ICreateCategoryUseCase } from "../../interfaces/category/ICreateCategoryUseCase";

export class CreateCategoryUseCase implements ICreateCategoryUseCase {
  constructor(private readonly _categoryRepo: ICategoryRepository) { }

  async execute(name: string) {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const existing = await this._categoryRepo.findBySlug(slug);
    if (existing) {
      throw new Error("Category already exists");
    }

    const category = new Category(
      "",
      name,
      slug,
      true,
      new Date(),
      new Date()
    );

    return await this._categoryRepo.create(category);
  }
}
