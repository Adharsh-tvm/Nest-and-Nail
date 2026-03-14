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

    async findOnlineWorkers(): Promise<Worker[]> {
        return await WorkerModel.find({
            role: "WORKER",
            isOnline: true,
            isBlocked: false
        }).lean() as unknown as Worker[];
    }


}