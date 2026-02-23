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

    async findEligibleWorkers(
        category: string,
        coordinates: [number, number],
        maxDistance: number
    ): Promise<Worker[]> {

        return await WorkerModel.find({
            role: "WORKER",
            isOnline: true,
            isBlocked: false,
            isAvailable: true,
            categories: category,
            "address.location": {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates
                    },
                    $maxDistance: maxDistance
                }
            }
        }).lean() as unknown as Worker[];
    }

    async reserveWorker(workerId: string): Promise<boolean> {

        const updated = await WorkerModel.findOneAndUpdate(
            { userId: workerId, isAvailable: true },
            { isAvailable: false },
            { new: true }
        );

        return !!updated;
    }

    async releaseWorker(workerId: string): Promise<void> {

        await WorkerModel.updateOne(
            { userId: workerId },
            { isAvailable: true }
        );
    }

    async incrementWeeklyJobCount(workerId: string): Promise<void> {

        await WorkerModel.updateOne(
            { userId: workerId },
            { $inc: { weeklyJobCount: 1 } }
        );
    }
}