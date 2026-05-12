import { IClientWorkerRestrictionRepository } from "../../domain/repositories/IClientWorkerRestrictionRepository";
import { ClientWorkerRestriction } from "../../domain/entities/ClientWorkerRestriction";
import { ClientWorkerRestrictionModel, IClientWorkerRestrictionDocument } from "../database/models/ClientWorkerRestrictionModel";

export class ClientWorkerRestrictionRepository implements IClientWorkerRestrictionRepository {
  private toEntity(doc: IClientWorkerRestrictionDocument): ClientWorkerRestriction {
    return {
      restrictionId: doc.restrictionId,
      clientId: doc.clientId,
      workerId: doc.workerId,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt,
    };
  }

  async create(restriction: ClientWorkerRestriction): Promise<ClientWorkerRestriction> {
    const doc = await ClientWorkerRestrictionModel.create({
      restrictionId: restriction.restrictionId,
      clientId: restriction.clientId,
      workerId: restriction.workerId,
      expiresAt: restriction.expiresAt,
    });
    return this.toEntity(doc);
  }

  async hasActiveRestriction(clientId: string, workerId: string): Promise<boolean> {
    const count = await ClientWorkerRestrictionModel.countDocuments({
      clientId,
      workerId,
      expiresAt: { $gt: new Date() },
    });
    return count > 0;
  }

  async getActiveRestriction(clientId: string, workerId: string): Promise<ClientWorkerRestriction | null> {
    const doc = await ClientWorkerRestrictionModel.findOne({
      clientId,
      workerId,
      expiresAt: { $gt: new Date() },
    });
    return doc ? this.toEntity(doc) : null;
  }

  async getExpiredRestrictions(): Promise<ClientWorkerRestriction[]> {
    const docs = await ClientWorkerRestrictionModel.find({
      expiresAt: { $lte: new Date() },
    });
    return docs.map((doc) => this.toEntity(doc));
  }

  async delete(restrictionId: string): Promise<boolean> {
    const result = await ClientWorkerRestrictionModel.deleteOne({ restrictionId });
    return result.deletedCount > 0;
  }
}
