import { Worker } from "../../domain/entities/Worker";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { WorkerModel } from "../database/models/WorkerModel";
import { BaseRepository } from "./BaseRepository";

export class WorkerRepository extends BaseRepository<Worker> implements IWorkerRepository {
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
            isVerified: worker.isVerified,
            profilePictureUrl: worker.profilePictureUrl,
            role: worker.role,
            skills: worker.skills,
            loginMethod: worker.loginMethod,
        }));
    }
}