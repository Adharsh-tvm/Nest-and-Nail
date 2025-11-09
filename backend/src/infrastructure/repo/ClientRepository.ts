import { Client } from "../../domain/entities/Client";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { ClientModel } from "../database/models/ClientModel";

export class ClientRepository implements IClientRepository {
  constructor(private readonly _clientModel = ClientModel) { }

  async findByEmail(email: string): Promise<Client | null> {
    return this._clientModel.findOne({ email: email }).lean();
  }

  async findById(id: string): Promise<Client | null> {
    return this._clientModel.findOne({ clientId: id }).lean();
  }

  async create(client: Client): Promise<Client> {
    const created = await this._clientModel.create(client);
    return created.toObject();
  }
}
