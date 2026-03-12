import { FilterQuery, Model, Document } from "mongoose";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { User } from "../../domain/entities/User";

export abstract class BaseRepository<T extends User, D extends Document = any> implements IBaseRepository<T> {
    constructor(protected readonly model: Model<D>) { }

    async findByEmail(email: string): Promise<T | null> {
        const result = await this.model
            .findOne({ email } as FilterQuery<D>)
            .lean()
            .exec();

        if (!result) {
            console.log(`[BaseRepository] No user found`);
            return null;
        }

        const { _id, __v, ...cleanResult } = result as any;

        return cleanResult as T;
    }

    async create(user: T): Promise<T> {
        const created = await this.model.create(user as any);
        const obj = created.toObject();

        const { _id, __v, ...cleanResult } = obj as any;

        return cleanResult as T;
    }

    async findById(id: string): Promise<T | null> {
        const result = await this.model
            .findOne({ userId: id } as FilterQuery<D>)
            .lean()
            .exec();


        if (!result) {
            console.log(`[BaseRepository] No user found`);
            return null;
        }

        const { _id, __v, ...cleanResult } = result as any;

        return cleanResult as T;
    }

    async findAll(): Promise<T[]> {
        const clients = await this.model.find().lean().exec();

        return clients.map(doc => {
            const { _id, __v, ...rest } = doc as any;
            return { id: _id.toString(), ...rest } as T;
        });
    }

    async update(email: string, updateData: Partial<T>): Promise<T | null> {
        const updated = await this.model
            .findOneAndUpdate(
                { email } as FilterQuery<D>,
                updateData as any,
                { new: true }
            )
            .lean()
            .exec();

        if (!updated) return null;

        const { _id, __v, ...clean } = updated as any;
        return clean as T;
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
                updateData as any,
                { new: true }
            )
            .lean()
            .exec();

        if (!updated) {
            console.log(`[BaseRepository] No user found to update`);
            return null;
        }

        const { _id, __v, ...clean } = updated as any;
        return clean as T;
    }

    async findWithQuery(
        filter: {
            isBlocked?: boolean;
            isVerified?: any;
            search?: string;
            role?: any;
        },
        options: {
            sortBy: string;
            sortOrder: "asc" | "desc";
            page: number;
            limit: number;
        }
    ): Promise<T[]> {

        const mongoFilter: any = {};

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
            .find(mongoFilter)
            .sort(sort)
            .skip(skip)
            .limit(options.limit)
            .lean()
            .exec();

        return results.map(doc => {
            const { _id, __v, ...rest } = doc as any;
            return rest as T;
        });
    }

    async findWithPagination(
        filter: {
            isBlocked?: boolean;
            isVerified?: any;
            search?: string;
            role?: any;
        },
        options: {
            sortBy: string;
            sortOrder: "asc" | "desc";
            page: number;
            limit: number;
        }
    ): Promise<{ users: T[]; total: number; totalPages: number }> {
        const mongoFilter: any = {};

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
                .find(mongoFilter)
                .sort(sort)
                .skip(skip)
                .limit(options.limit)
                .lean()
                .exec(),
            this.model.countDocuments(mongoFilter),
        ]);

        const totalPages = Math.ceil(total / options.limit);

        return {
            users: users.map(doc => {
                const { _id, __v, ...rest } = doc as any;
                return { id: _id.toString(), ...rest } as T;
            }),
            total,
            totalPages,
        };
    }


}