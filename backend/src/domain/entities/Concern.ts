import { concernBy, concernStatus } from "../../shared/enums/concernEnums";

export interface Concern {
  concernId: string;
  serviceId: string;
  userId: string;
  raisedBy: concernBy
  message: string;
  status: concernStatus
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolutionMessage?: string;
  images?: string[];
}