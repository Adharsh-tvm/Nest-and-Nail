import { Category } from "../../domain/entities/Category";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { CategoryModel } from "../database/models/CategoryModel";

export class CategoryRepository implements ICategoryRepository {
    async create(category: Category): Promise<Category> {
        const doc = await CategoryModel.create({
            name: category.name,
            slug: category.slug,
            isActive: category.isActive,
        });

        return new Category(
            doc.id,
            doc.name,
            doc.slug,
            doc.isActive,
            doc.createdAt
        );
    }

    async findAll(): Promise<Category[]> {
        const docs = await CategoryModel.find().sort({ createdAt: -1 });

        return docs.map(
            (doc) =>
                new Category(
                    doc.id,
                    doc.name,
                    doc.slug,
                    doc.isActive,
                    doc.createdAt
                )
        );
    }

    async findBySlug(slug: string): Promise<Category | null> {
        const doc = await CategoryModel.findOne({ slug });
        if (!doc) return null;

        return new Category(
            doc.id,
            doc.name,
            doc.slug,
            doc.isActive,
            doc.createdAt
        );
    }

    async findByIds(ids: string[]): Promise<Category[]> {
        const docs = await CategoryModel.find({
            _id: { $in: ids },
            isActive: true,
        }).lean();

        return docs.map(
            doc =>
                new Category(
                    doc._id.toString(),
                    doc.name,
                    doc.slug,
                    doc.isActive,
                    doc.createdAt
                )
        );
    }

    async update(
        id: string,
        data: {
            name: string;
            slug: string;
            isActive: boolean;
        }
    ): Promise<Category> {
        const updated = await CategoryModel.findByIdAndUpdate(
            id,
            {
                name: data.name,
                slug: data.slug,
                isActive: data.isActive,
            },
            { new: true }
        );

        if (!updated) {
            throw new Error("Category not found");
        }

        return new Category(
            updated.id,
            updated.name,
            updated.slug,
            updated.isActive,
            updated.createdAt
        );
    }

}