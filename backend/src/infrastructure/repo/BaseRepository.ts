import { FilterQuery, Model } from "mongoose";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { User } from "../../domain/entities/User";

export abstract class BaseRepository<T extends User> implements IBaseRepository<T> {
    constructor(protected readonly model: Model<T>) { }

    async findByEmail(email: string): Promise<T | null> {
        console.log(`[BaseRepository] Finding user by email: ${email}`);
        const result = await this.model
            .findOne({ email } as FilterQuery<T>)
            .lean()
            .exec();

        console.log(`[BaseRepository] Raw result from DB:`, JSON.stringify(result, null, 2));

        if (!result) {
            console.log(`[BaseRepository] No user found`);
            return null;
        }

        const { _id, __v, ...cleanResult } = result as any;
        console.log(`[BaseRepository] Cleaned result:`, JSON.stringify(cleanResult, null, 2));

        return cleanResult as T;
    }

    async create(user: T): Promise<T> {
        console.log(`[BaseRepository] Creating user:`, JSON.stringify(user, null, 2));
        const created = await this.model.create(user);
        const obj = created.toObject();

        console.log(`[BaseRepository] Created user (raw):`, JSON.stringify(obj, null, 2));

        const { _id, __v, ...cleanResult } = obj as any;
        console.log(`[BaseRepository] Created user (clean):`, JSON.stringify(cleanResult, null, 2));

        return cleanResult as T;
    }

    async findById(id: string): Promise<T | null> {
        console.log(`[BaseRepository] Finding user by ID: ${id}`);
        const result = await this.model
            .findOne({ userId: id } as FilterQuery<T>)
            .lean()
            .exec();

        console.log(`[BaseRepository] Raw result from DB:`, JSON.stringify(result, null, 2));

        if (!result) {
            console.log(`[BaseRepository] No user found`);
            return null;
        }

        const { _id, __v, ...cleanResult } = result as any;
        console.log(`[BaseRepository] Cleaned result:`, JSON.stringify(cleanResult, null, 2));

        return cleanResult as T;
    }

    async findAll(): Promise<T[]> {
        console.log(`[BaseRepository] Finding all users`);
        const clients = await this.model.find().lean().exec();

        return clients.map(doc => {
            const { _id, __v, ...rest } = doc as any;
            return { id: _id.toString(), ...rest } as T;
        });
    }

    async update(email: string, updateData: Partial<T>): Promise<T | null> {
        const updated = await this.model
            .findOneAndUpdate(
                { email } as FilterQuery<T>,
                updateData,
                { new: true }
            )
            .lean()
            .exec();

        if (!updated) return null;

        const { _id, __v, ...clean } = updated as any;
        return clean as T;
    }

    async delete(email: string): Promise<boolean> {
        console.log(`[BaseRepository] Deleting user by email: ${email}`);
        const result = await this.model
            .deleteOne({ email } as FilterQuery<T>)
            .exec();

        console.log(`[BaseRepository] Delete result:`, result);
        return result.deletedCount > 0;
    }


    async deleteByUserId(userId: string): Promise<boolean> {
        console.log(`[BaseRepository] Deleting user by userId: ${userId}`);
        try {
            const result = await this.model
                .deleteOne({ userId } as FilterQuery<T>)
                .exec();

            console.log(`[BaseRepository] Delete result:`, result);
            return result.deletedCount > 0;
        } catch (error) {
            console.error(`[BaseRepository] Error deleting user:`, error);
            return false;
        }
    }

    async updateById(userId: string, updateData: Partial<T>): Promise<T | null> {
        console.log(`[BaseRepository] Updating user by ID: ${userId}`);
        console.log(`[BaseRepository] Update data:`, JSON.stringify(updateData, null, 2));

        const updated = await this.model
            .findOneAndUpdate(
                { userId } as FilterQuery<T>,
                updateData,
                { new: true }
            )
            .lean()
            .exec();

        if (!updated) {
            console.log(`[BaseRepository] No user found to update`);
            return null;
        }

        const { _id, __v, ...clean } = updated as any;
        console.log(`[BaseRepository] Updated user:`, JSON.stringify(clean, null, 2));
        return clean as T;
    }


}