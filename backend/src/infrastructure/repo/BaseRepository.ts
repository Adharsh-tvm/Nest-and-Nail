import { FilterQuery, Model } from "mongoose";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { User } from "../../domain/entities/User";

export abstract class BaseRepository<T extends User> implements IBaseRepository<T> {
    constructor(protected readonly model: Model<T>) { }

    async findByEmail(email: string): Promise<T | null> {
        const result = await this.model
            .findOne({ email } as FilterQuery<T>)
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
        const created = await this.model.create(user);
        const obj = created.toObject();

        const { _id, __v, ...cleanResult } = obj as any;

        return cleanResult as T;
    }

    async findById(id: string): Promise<T | null> {
        const result = await this.model
            .findOne({ userId: id } as FilterQuery<T>)
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
        const result = await this.model
            .deleteOne({ email } as FilterQuery<T>)
            .exec();

        return result.deletedCount > 0;
    }


    async deleteByUserId(userId: string): Promise<boolean> {
        try {
            const result = await this.model
                .deleteOne({ userId } as FilterQuery<T>)
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
        return clean as T;
    }


}