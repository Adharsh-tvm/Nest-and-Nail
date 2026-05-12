import { ClientWorkerRestriction } from "../entities/ClientWorkerRestriction";

export interface IClientWorkerRestrictionRepository {
  create(restriction: ClientWorkerRestriction): Promise<ClientWorkerRestriction>;
  hasActiveRestriction(clientId: string, workerId: string): Promise<boolean>;
  getActiveRestriction(clientId: string, workerId: string): Promise<ClientWorkerRestriction | null>;
  getExpiredRestrictions(): Promise<ClientWorkerRestriction[]>;
  delete(restrictionId: string): Promise<boolean>;
}
