import { FilterQuery, Model } from "mongoose";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { User } from "../../domain/entities/User";
import { LoginMethod } from "../../shared/enums/enums";

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

        // Clean Mongoose fields
        const { _id, __v, ...cleanResult } = result as any;
        console.log(`[BaseRepository] Cleaned result:`, JSON.stringify(cleanResult, null, 2));

        return cleanResult as T;
    }



    async create(user: T): Promise<T> {
        console.log(`[BaseRepository] Creating user:`, JSON.stringify(user, null, 2));
        const created = await this.model.create(user);
        const obj = created.toObject();

        console.log(`[BaseRepository] Created user (raw):`, JSON.stringify(obj, null, 2));

        // Clean Mongoose fields
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

        // Clean Mongoose fields
        const { _id, __v, ...cleanResult } = result as any;
        console.log(`[BaseRepository] Cleaned result:`, JSON.stringify(cleanResult, null, 2));

        return cleanResult as T;
    }

    async findAll(): Promise<T[]> {
        console.log(`[BaseRepository] Finding all users `);
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

}