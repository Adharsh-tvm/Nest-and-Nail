import { Client } from "../../domain/entities/Client";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { ClientModel } from "../database/models/ClientModel";
import { BaseRepository } from "./BaseRepository";

export class ClientRepository extends BaseRepository<Client> implements IClientRepository {
    constructor() {
        super(ClientModel);
    }

    async findAll(): Promise<Client[]> {
        const rawClients = await super.findAll();

        return rawClients.map(client => ({
            userId: client.userId,
            name: client.name,
            email: client.email,
            passwordhash: client.passwordhash,
            lastLoginAt: client.lastLoginAt,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
            isBlocked: client.isBlocked,
            profilePictureUrl: client.profilePictureUrl,
            role: client.role,
            loginMethod: client.loginMethod,
        }));
    }
}
