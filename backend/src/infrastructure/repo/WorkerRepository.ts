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
        categoryName?: string,
        lat?: number,
        lng?: number,
        search?: string,
        isOnline?: boolean,
        page?: number,
        limit?: number,
        sortBy?: string
    ): Promise<{ workers: Worker[]; total: number }> {

        const pipeline: any[] = [];

        // ── 1. Geo-near must be the first stage when lat/lng are provided ──
        if (lat && lng) {
            pipeline.push({
                $geoNear: {
                    near: { type: "Point", coordinates: [lng, lat] },
                    distanceField: "distance",
                    maxDistance: 30000, // 30 km
                    spherical: true,
                }
            });
        }

        // ── 2. Base match (non-category) so we skip blocked/unverified early ──
        const baseMatch: any = {
            role: "worker",
            isBlocked: false,
            isVerified: "VERIFIED",
        };
        if (isOnline === true) baseMatch.isOnline = true;
        if (search && search.trim().length > 0) {
            baseMatch.name = { $regex: search.trim(), $options: 'i' };
        }
        pipeline.push({ $match: baseMatch });

        // ── 3. Join categories so we can filter by name ──
        pipeline.push({
            $lookup: {
                from: "categories",
                localField: "categories",
                foreignField: "_id",
                as: "categoryDocs"
            }
        });

        // ── 4. Filter by category NAME (after the join) ──
        if (categoryName && categoryName.trim().length > 0) {
            pipeline.push({
                $match: {
                    "categoryDocs.name": {
                        $regex: `^${categoryName.trim()}$`,
                        $options: "i"
                    }
                }
            });
        }

        // ── 5. Determine Sort Stage ──
        const sortStage: any = { $sort: {} };
        if (sortBy === 'rating_desc') {
            sortStage.$sort.rating = -1;
        } else if (sortBy === 'distance_asc' && lat && lng) {
            sortStage.$sort.distance = 1;
        } else {
            sortStage.$sort.rating = -1; // Default
        }

        // ── 6. Facet for count and data ──
        const dataPipeline: any[] = [sortStage];
        if (page && limit) {
            dataPipeline.push({ $skip: (page - 1) * limit });
            dataPipeline.push({ $limit: limit });
        }

        pipeline.push({
            $facet: {
                data: dataPipeline,
                total: [{ $count: "count" }]
            }
        });

        const result = await WorkerModel.aggregate(pipeline);
        const workersRaw = result[0].data || [];
        const total = result[0].total[0]?.count || 0;

        const workers = workersRaw.map((doc: any) => {
            const { _id, __v, categories, categoryDocs, ...rest } = doc;
            return {
                ...rest,
                userId: rest.userId || _id.toString(),
                categories: categoryDocs?.map((cat: any) => cat.name) || [],
                distance: rest.distance,
            } as Worker;
        });

        return { workers, total };
    }
}