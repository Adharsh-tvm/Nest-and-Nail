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
        lng?: number
    ): Promise<Worker[]> {

        const query: any = {
            role: "worker",
            isBlocked: false,
            isVerified: "VERIFIED",
            isAvailable: true
        };

        if (categoryId) {
            query.categories = categoryId;
        }

        if (lat && lng) {
            query["address.location"] = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    $maxDistance: 20000 // 10km
                }
            };
        }

        const workers = await WorkerModel.find(query)
            .sort({ rating: -1 })
            .lean();

        return workers.map((doc: any) => {
            const { _id, __v, ...rest } = doc;
            return rest as Worker;
        });
    }
}