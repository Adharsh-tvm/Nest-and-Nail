import { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import { ServiceRequestStatus } from "../../../shared/enums/serviceEnums";
import { IGetServiceRequestByIdUseCase } from "../../interfaces/service-requests/IGetServiceRequestByIdUseCase";


import { S3Service } from "../../../infrastructure/adapters/S3service";

export class GetServiceRequestByIdUseCase implements IGetServiceRequestByIdUseCase {
    constructor(
        private readonly _serviceRequestRepo: IServiceRequestRepository,
        private readonly _s3Service: S3Service
    ) { }

    async execute(requestId: string, userId: string) {
        let request = await this._serviceRequestRepo.findByRequestId(requestId);

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

        if (request.servicePhotos && request.servicePhotos.length > 0) {
            request.servicePhotos = await Promise.all(request.servicePhotos.map(async (photo) => {
                return !photo.startsWith("http") ? await this._s3Service.getPresignedDownloadUrl(photo) : photo;
            }));
        }

        // Also sign client profile picture if it's a key
        if (request.client?.profilePictureUrl && !request.client.profilePictureUrl.startsWith("http")) {
            request.client.profilePictureUrl = await this._s3Service.getPresignedDownloadUrl(request.client.profilePictureUrl);
        }

        return request;
    }
}
