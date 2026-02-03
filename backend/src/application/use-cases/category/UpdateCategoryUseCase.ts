import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IUpdateCategoryUseCase } from "../../interfaces/category/IUpdateCategoryUseCase";

export class UpdateCategoryUseCase implements IUpdateCategoryUseCase {
    constructor(private readonly _categoryRepo: ICategoryRepository) { }

    async execute(
        id: string,
        data: {
            name: string;
            slug: string;
            isActive: boolean;
        }
    ) {
        const slug = data.slug
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");

        const existing = await this._categoryRepo.findBySlug(slug);
        if (existing && existing.id !== id) {
            throw new Error("Category slug already exists");
        }

        return this._categoryRepo.update(id, {
            name: data.name,
            slug,
            isActive: data.isActive,
        });
    }
}
