import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { Category } from "../../../domain/entities/Category";
import { ICreateCategoryUseCase } from "../../interfaces/ICreateCategoryUseCase";

export class CreateCategoryUseCase implements ICreateCategoryUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(name: string) {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const existing = await this.categoryRepo.findBySlug(slug);
    if (existing) {
      throw new Error("Category already exists");
    }

    const category = new Category(
      "",
      name,
      slug,
      true,
      new Date()
    );

    return await this.categoryRepo.create(category);
  }
}
