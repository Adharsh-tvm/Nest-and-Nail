import { IServiceRequestRepository } from "../../../../domain/repositories/IServiceRequestRepository";
import { ServiceRequestStatus } from "../../../../shared/enums/serviceEnums";
import { IDeleteServiceRequestUseCase } from "../../../interfaces/service-requests/client/IDeleteServiceRequestUseCase";


export class DeleteServiceRequestUseCase implements IDeleteServiceRequestUseCase {
    constructor(private _serviceRequestRepository: IServiceRequestRepository) { }

    async execute(requestId: string, clientId: string): Promise<boolean> {
        const request = await this._serviceRequestRepository.findByRequestId(requestId);

        if (!request) {
            throw new Error("Service request not found");
        }

        if (request.clientId !== clientId) {
            throw new Error("Unauthorized to delete this request");
        }

        if (request.status === ServiceRequestStatus.CONFIRMED || request.status === ServiceRequestStatus.RESERVED || request.status === ServiceRequestStatus.ARCHIVED) {
            throw new Error("Cannot delete a request that is confirmed, in progress, or completed.");
        }

        return await this._serviceRequestRepository.delete(requestId);
    }
}
