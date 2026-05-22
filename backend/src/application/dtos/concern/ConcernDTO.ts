import { Concern } from "../../../domain/entities/Concern";

export interface ConcernResponseDTO extends Concern {
  clientName?: string;
  clientEmail?: string;
  workerName?: string;
  workerEmail?: string;
  raisedByName?: string;
  raisedByEmail?: string;
  serviceName?: string;
  serviceDescription?: string;
  serviceScheduledDate?: Date;
  serviceAmount?: number;
}
