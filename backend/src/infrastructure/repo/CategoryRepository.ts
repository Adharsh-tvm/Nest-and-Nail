import { Category } from "../../domain/entities/Category";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { CategoryModel } from "../database/models/CategoryModel";
import { FilterQuery } from "mongoose";

export class CategoryRepository implements ICategoryRepository {
    async create(category: Category): Promise<Category> {
        const doc = await CategoryModel.create({
            name: category.name,
            slug: category.slug,
            isActive: category.isActive,
        });

        return new Category(
            doc.id as string,
            doc.name,
            doc.slug,
            doc.isActive,
            doc.createdAt,
            doc.updatedAt
        );
    }

    async findAll(options?: {
        search?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }): Promise<{
        categories: Category[];
        total: number;
        activeCount: number;
        inactiveCount: number;
    }> {
        const query: FilterQuery<typeof CategoryModel> = {};

        if (options?.search) {
            query.$or = [
                { name: { $regex: options.search, $options: "i" } },
                { slug: { $regex: options.search, $options: "i" } },
            ];
        }

        const total = await CategoryModel.countDocuments(query);
        const activeCount = await CategoryModel.countDocuments({ ...query, isActive: true } as FilterQuery<typeof CategoryModel>);
        const inactiveCount = total - activeCount;

        const sortField = options?.sortBy ?? "name";
        const sortOrder = options?.sortOrder === "desc" ? -1 : 1;
        const sortOptions: Record<string, 1 | -1> = { [sortField]: sortOrder };

        let mongoQuery = CategoryModel.find(query).sort(sortOptions);

        if (options?.page && options.limit) {
            mongoQuery = mongoQuery
                .skip((options.page - 1) * options.limit)
                .limit(options.limit);
        }

        const docs = await mongoQuery;

        const categories = docs.map(
            (doc) =>
                new Category(
                    doc.id as string,
                    doc.name,
                    doc.slug,
                    doc.isActive,
                    doc.createdAt,
                    doc.updatedAt
                )
        );

        return { categories, total, activeCount, inactiveCount };
    }

    async findBySlug(slug: string): Promise<Category | null> {
        const doc = await CategoryModel.findOne({ slug });
        if (!doc) return null;

        return new Category(
            doc.id as string,
            doc.name,
            doc.slug,
            doc.isActive,
            doc.createdAt,
            doc.updatedAt
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
                    (doc._id as { toString(): string }).toString(),
                    doc.name,
                    doc.slug,
                    doc.isActive,
                    doc.createdAt,
                    doc.updatedAt
                )
        );
    }

    async findById(id: string): Promise<Category | null> {
        const doc = await CategoryModel.findById(id);
        if (!doc) return null;

        return new Category(
            doc.id as string,
            doc.name,
            doc.slug,
            doc.isActive,
            doc.createdAt,
            doc.updatedAt
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
            updated.id as string,
            updated.name,
            updated.slug,
            updated.isActive,
            updated.createdAt,
            updated.updatedAt
        );
    }

}