import { Client } from "../../domain/entities/Client";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { ClientModel } from "../database/models/ClientModel";
import { BaseRepository } from "./BaseRepository";

export class ClientRepository extends BaseRepository<Client> implements IClientRepository {
    constructor() {
        super(ClientModel);
    }
}