import { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import { ServiceRequestStatus } from "../../../shared/enums/serviceEnums";
import { IGetServiceRequestByIdUseCase } from "../../interfaces/service-requests/IGetServiceRequestByIdUseCase";


export class GetServiceRequestByIdUseCase implements IGetServiceRequestByIdUseCase {
    constructor(
        private readonly _serviceRequestRepo: IServiceRequestRepository
    ) { }

    async execute(requestId: string, userId: string) {
        const request = await this._serviceRequestRepo.findByRequestId(requestId);

        if (!request) {
            throw new Error("Service request not found");
        }

        // 🔐 Authorization rule
        const isClient = request.clientId === userId;
        const isWorkerAllowed =
            request.status === ServiceRequestStatus.OPEN ||
            request.reservedBy === userId;

        if (!isClient && !isWorkerAllowed) {
            throw new Error("You are not allowed to view this request");
        }

        return request;
    }
}
