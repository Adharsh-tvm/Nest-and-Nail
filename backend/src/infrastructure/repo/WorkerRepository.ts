import { Worker } from "../../domain/entities/Worker";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { WorkerModel, IWorkerDocument } from "../database/models/WorkerModel";
import { BaseRepository } from "./BaseRepository";
import { PipelineStage } from "mongoose";

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
            documents: worker.documents ?? [],
            certificates: worker.certificates ?? [],
            categories: worker.categories ?? [],
            workPhotos: worker.workPhotos ?? []
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

        const pipeline: unknown[] = [];

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
        const baseMatch: Record<string, unknown> = {
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
        const sortStage: { $sort: Record<string, 1 | -1> } = { $sort: {} };
        if (sortBy === 'rating_desc') {
            sortStage.$sort.rating = -1;
        } else if (sortBy === 'distance_asc' && lat && lng) {
            sortStage.$sort.distance = 1;
        } else {
            sortStage.$sort.rating = -1; // Default
        }

        // ── 6. Facet for count and data ──
        const dataPipeline: Record<string, unknown>[] = [sortStage as unknown as Record<string, unknown>];
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

        const result = await WorkerModel.aggregate(pipeline as unknown as PipelineStage[]);
        const firstResult = result[0] as { data?: Record<string, unknown>[]; total?: { count: number }[] } | undefined;
        const workersRaw = firstResult?.data ?? [];
        const total = firstResult?.total?.[0]?.count ?? 0;

        const workers = workersRaw.map((doc) => {
            const rest = { ...doc };
            const docId = doc._id as { toString(): string };
            const categoryDocs = doc.categoryDocs as { name: string }[] | undefined;
            delete (rest as Record<string, unknown>)._id;
            delete (rest as Record<string, unknown>).__v;
            delete (rest as Record<string, unknown>).categories;
            delete (rest as Record<string, unknown>).categoryDocs;

            return {
                ...rest,
                userId: (rest.userId as string | undefined) ?? docId.toString(),
                categories: categoryDocs?.map((cat) => cat.name) ?? [],
                distance: rest.distance as number | undefined,
            } as unknown as Worker;
        });

        return { workers, total };
    }
}