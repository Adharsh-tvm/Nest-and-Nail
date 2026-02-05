import { ServiceRequest } from "../../../../domain/entities/ServiceRequest";
import { IServiceRequestRepository } from "../../../../domain/repositories/IServiceRequestRepository";
import { IGetMyServiceRequestsUseCase } from "../../../interfaces/service-requests/client/IGetMyServiceRequestsUseCase";

export class GetMyServiceRequestsUseCase implements IGetMyServiceRequestsUseCase {

  constructor(
    private readonly _repo: IServiceRequestRepository
  ) {}

  async execute(clientId: string): Promise<ServiceRequest[]> {
    return this._repo.findByClientId(clientId);
  }
}
