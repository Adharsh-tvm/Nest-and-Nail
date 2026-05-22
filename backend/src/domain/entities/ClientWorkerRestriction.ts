export interface ClientWorkerRestriction {
  restrictionId: string;
  clientId: string;
  workerId: string;
  expiresAt: Date;
  createdAt: Date;
}
