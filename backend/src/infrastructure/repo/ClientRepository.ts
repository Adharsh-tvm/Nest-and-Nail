import { Client } from "../../domain/entities/Client";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { ClientModel, IClientDocument } from "../database/models/ClientModel";
import { BaseRepository } from "./BaseRepository";

export class ClientRepository extends BaseRepository<Client, IClientDocument> implements IClientRepository {
    constructor() {
        super(ClientModel);
    }

    async findAll(): Promise<Client[]> {
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
            isOnline: worker.isOnline,
            profilePictureUrl: worker.profilePictureUrl,
            role: worker.role,
            skills: worker.skills,
            loginMethod: worker.loginMethod,
            documents: worker.documents || [],
            certificates: worker.certificates || [],
            workPhotos: worker.workPhotos || []
        }));
    }
}
