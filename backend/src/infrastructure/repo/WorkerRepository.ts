import { Worker } from "../../domain/entities/Worker";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { WorkerModel, IWorkerDocument } from "../database/models/WorkerModel";
import { BaseRepository } from "./BaseRepository";

export class WorkerRepository extends BaseRepository<Worker, IWorkerDocument> implements IWorkerRepository {
    constructor() {
        super(WorkerModel);
    }

    async findAll(): Promise<Worker[]> {
        const rawWorkers = await super.findAll();

        return rawWorkers.map(worker => ({
            userId: worker.userId,
            name: worker.name,
            email: worker.email,
            passwordhash: worker.passwordhash,
            lastLoginAt: worker.lastLoginAt,
            createdAt: worker.createdAt,
            updatedAt: worker.updatedAt,
            isBlocked: worker.isBlocked,
            isOnline: worker.isOnline,
            isVerified: worker.isVerified,
            profilePictureUrl: worker.profilePictureUrl,
            role: worker.role,
            skills: worker.skills,
            loginMethod: worker.loginMethod,
            documents: worker.documents || [],
            certificates: worker.certificates || [],
            categories: worker.categories || [],
            workPhotos: worker.workPhotos || []
        }));
    }

    async findAvailableWorkers(
        categoryId?: string,
        lat?: number,
        lng?: number,
        search?: string,      // optional name keyword search
        isOnline?: boolean    // optional online status filter
    ): Promise<Worker[]> {

        // Base filter conditions for all worker queries
        const matchStage: any = {
            role: "worker",
            isBlocked: false,
            isVerified: "VERIFIED",
        };

        // Filter by category if provided
        if (categoryId) {
            matchStage.categories = categoryId;
        }

        // Filter by online status if requested
        if (isOnline === true) {
            matchStage.isOnline = true;
        }

        // Search by worker name (case-insensitive partial match)
        if (search && search.trim().length > 0) {
            matchStage.name = { $regex: search.trim(), $options: 'i' };
        }

        const pipeline: any[] = [];

        if (lat && lng) {
            pipeline.push({
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    distanceField: "distance",
                    maxDistance: 30000, // 20km
                    spherical: true
                }
            });
        }

        pipeline.push({ $match: matchStage });

        pipeline.push(
            {
                $lookup: {
                    from: "categories",
                    localField: "categories",
                    foreignField: "_id",
                    as: "categoryDocs"
                }
            },
            {
                $sort: { rating: -1 }
            }
        );

        const workers = await WorkerModel.aggregate(pipeline);

        return workers.map((doc: any) => {
            const { _id, __v, categories, categoryDocs, ...rest } = doc;
            const mappedCategories = categoryDocs?.map((cat: any) => cat.name) || [];
            return {
                ...rest,
                userId: rest.userId || _id.toString(), // ensure userId is present
                categories: mappedCategories,
                distance: rest.distance
            } as Worker;
        });
    }
}