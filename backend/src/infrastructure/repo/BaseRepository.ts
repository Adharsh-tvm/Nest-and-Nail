import { FilterQuery, Model, Document } from "mongoose";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { User } from "../../domain/entities/User";

export abstract class BaseRepository<T extends User, D extends Document = Document> implements IBaseRepository<T> {
    constructor(protected readonly model: Model<D>) { }

    async findByEmail(email: string): Promise<T | null> {
        const result = await this.model
            .findOne({ email } as FilterQuery<D>)
            .populate('categories', 'name')
            .lean()
            .exec();

        if (!result) {
            console.log(`[BaseRepository] No user found`);
            return null;
        }

        const leanObj = result as unknown as Record<string, unknown> & { categories?: Array<{ _id?: { toString(): string } } | string> };
        const mappedCategories = leanObj.categories?.map((cat) => {
            if (typeof cat === 'object' && cat !== null && '_id' in cat && cat._id) {
                return cat._id.toString();
            }
            return cat.toString();
        }) || [];
        const { _id, __v, categories, ...cleanResult } = leanObj;

        return { ...cleanResult, categories: mappedCategories } as unknown as T;
    }

    async create(user: T): Promise<T> {
        const created = await this.model.create(user as unknown as Partial<D>);
        const obj = created.toObject();

        const { _id, __v, ...cleanResult } = obj as unknown as Record<string, unknown>;

        return cleanResult as unknown as T;
    }

    async findById(id: string): Promise<T | null> {
        const result = await this.model
            .findOne({ userId: id } as FilterQuery<D>)
            .populate('categories', 'name')
            .lean()
            .exec();


        if (!result) {
            console.log(`[BaseRepository] No user found`);
            return null;
        }

        const leanObj = result as unknown as Record<string, unknown> & { categories?: Array<{ _id?: { toString(): string } } | string> };
        const mappedCategories = leanObj.categories?.map((cat) => {
            if (typeof cat === 'object' && cat !== null && '_id' in cat && cat._id) {
                return cat._id.toString();
            }
            return cat.toString();
        }) || [];
        const { _id, __v, categories, ...cleanResult } = leanObj;

        return { ...cleanResult, categories: mappedCategories } as unknown as T;
    }

    async findAll(): Promise<T[]> {
        const clients = await this.model.find().lean().exec();

        return clients.map(doc => {
            const leanDoc = doc as Record<string, unknown> & { _id: { toString(): string } };
            const { _id, __v, ...rest } = leanDoc;
            return { id: _id.toString(), ...rest } as unknown as T;
        });
    }

    async update(email: string, updateData: Partial<T>): Promise<T | null> {
        const updated = await this.model
            .findOneAndUpdate(
                { email } as FilterQuery<D>,
                updateData as unknown as Partial<D>,
                { new: true }
            )
            .lean()
            .exec();

        if (!updated) return null;

        const { _id, __v, ...clean } = updated as Record<string, unknown>;
        return clean as unknown as T;
    }

    async delete(email: string): Promise<boolean> {
        const result = await this.model
            .deleteOne({ email } as FilterQuery<D>)
            .exec();

        return result.deletedCount > 0;
    }


    async deleteByUserId(userId: string): Promise<boolean> {
        try {
            const result = await this.model
                .deleteOne({ userId } as FilterQuery<D>)
                .exec();

            return result.deletedCount > 0;
        } catch (error) {
            console.error(`[BaseRepository] Error deleting user:`, error);
            return false;
        }
    }

    async updateById(userId: string, updateData: Partial<T>): Promise<T | null> {

        const updated = await this.model
            .findOneAndUpdate(
                { userId } as FilterQuery<D>,
                updateData as unknown as Partial<D>,
                { new: true }
            )
            .lean()
            .exec();

        if (!updated) {
            console.log(`[BaseRepository] No user found to update`);
            return null;
        }

        const { _id, __v, ...clean } = updated as Record<string, unknown>;
        return clean as unknown as T;
    }

    async findWithQuery(
        filter: {
            isBlocked?: boolean;
            isVerified?: string | boolean;
            search?: string;
            role?: string | Record<string, unknown>;
        },
        options: {
            sortBy: string;
            sortOrder: "asc" | "desc";
            page: number;
            limit: number;
        }
    ): Promise<T[]> {

        const mongoFilter: Record<string, unknown> = {};

        if (typeof filter.isBlocked === "boolean") {
            mongoFilter.isBlocked = filter.isBlocked;
        }

        if (filter.isVerified) {
            mongoFilter.isVerified = filter.isVerified;
        }

        if (filter.role) {
            mongoFilter.role = filter.role;
        }

        if (filter.search) {
            mongoFilter.$or = [
                { name: { $regex: filter.search, $options: "i" } },
                { email: { $regex: filter.search, $options: "i" } },
            ];
        }

        const sort: Record<string, 1 | -1> = {
            [options.sortBy]: options.sortOrder === "asc" ? 1 : -1,
        };

        const skip = (options.page - 1) * options.limit;

        const results = await this.model
            .find(mongoFilter as FilterQuery<D>)
            .sort(sort)
            .skip(skip)
            .limit(options.limit)
            .lean()
            .exec();

        return results.map(doc => {
            const { _id, __v, ...rest } = doc as Record<string, unknown>;
            return rest as unknown as T;
        });
    }

    async findWithPagination(
        filter: {
            isBlocked?: boolean;
            isVerified?: string | boolean;
            search?: string;
            role?: string | Record<string, unknown>;
        },
        options: {
            sortBy: string;
            sortOrder: "asc" | "desc";
            page: number;
            limit: number;
        }
    ): Promise<{ users: T[]; total: number; totalPages: number }> {
        const mongoFilter: Record<string, unknown> = {};

        if (typeof filter.isBlocked === "boolean") {
            mongoFilter.isBlocked = filter.isBlocked;
        }

        if (filter.isVerified) {
            mongoFilter.isVerified = filter.isVerified;
        }

        if (filter.role) {
            mongoFilter.role = filter.role;
        }

        if (filter.search) {
            mongoFilter.$or = [
                { name: { $regex: filter.search, $options: "i" } },
                { email: { $regex: filter.search, $options: "i" } },
            ];
        }

        const sort: Record<string, 1 | -1> = {
            [options.sortBy]: options.sortOrder === "asc" ? 1 : -1,
        };

        const skip = (options.page - 1) * options.limit;

        const [users, total] = await Promise.all([
            this.model
                .find(mongoFilter as FilterQuery<D>)
                .sort(sort)
                .skip(skip)
                .limit(options.limit)
                .lean()
                .exec(),
            this.model.countDocuments(mongoFilter as FilterQuery<D>),
        ]);

        const totalPages = Math.ceil(total / options.limit);

        return {
            users: users.map(doc => {
                const leanDoc = doc as Record<string, unknown> & { _id: { toString(): string } };
                const { _id, __v, ...rest } = leanDoc;
                return { id: _id.toString(), ...rest } as unknown as T;
            }),
            total,
            totalPages,
        };
    }


}