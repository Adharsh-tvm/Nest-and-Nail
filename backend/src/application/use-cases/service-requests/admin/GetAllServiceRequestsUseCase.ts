import { IServiceRequestRepository } from "../../../../domain/repositories/IServiceRequestRepository";
import { ServiceRequest } from "../../../../domain/entities/ServiceRequest";
import { IGetAllServiceRequestsUseCase } from "../../../interfaces/service-requests/admin/IGetAllServiceRequestsUseCase";

export class GetAllServiceRequestsUseCase
    implements IGetAllServiceRequestsUseCase {

    constructor(
        private readonly _serviceRequestRepo: IServiceRequestRepository
    ) { }

    async execute(): Promise<ServiceRequest[]> {
        return this._serviceRequestRepo.findAll();
    }
}
