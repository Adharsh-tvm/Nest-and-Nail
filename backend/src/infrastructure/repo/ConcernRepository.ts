import { Concern } from "../../domain/entities/Concern";
import { IConcernRepository } from "../../domain/repositories/IConcernRepository";
import { ConcernModel } from "../database/models/ConcernModel";
import { FilterQuery } from "mongoose";

export class ConcernRepository implements IConcernRepository {

    async create(data: Concern): Promise<Concern> {
        return await ConcernModel.create(data);
    }

    async findByUser(userId: string): Promise<Concern[]> {
        return ConcernModel.find({ userId }).sort({ createdAt: -1 });
    }

    async findByService(serviceId: string): Promise<Concern[]> {
        return ConcernModel.find({ serviceId });
    }

    async findAll(query: {
        status?: string;
        search?: string;
        page: number;
        limit: number;
    }) {
        const { status, search, page, limit } = query;

        const filter: FilterQuery<typeof ConcernModel> = {};

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { serviceId: { $regex: search, $options: "i" } },
                { userId: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (page - 1) * limit;

        const [concerns, total] = await Promise.all([
            ConcernModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            ConcernModel.countDocuments(filter)
        ]);

        return {
            concerns,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }

    async findById(concernId: string): Promise<Concern | null> {
        return ConcernModel.findOne({ concernId });
    }

    async update(concernId: string, data: Partial<Concern>): Promise<Concern | null> {
        return ConcernModel.findOneAndUpdate({ concernId }, { $set: data }, { new: true });
    }
}