import { ServiceRequest } from "../../../../domain/entities/ServiceRequest";
import { IServiceRequestRepository } from "../../../../domain/repositories/IServiceRequestRepository";
import { IGetOpenServiceRequestsUseCase } from "../../../interfaces/service-requests/worker/IGetOpenServiceRequestsUseCase";

import { S3Service } from "../../../../infrastructure/adapters/S3service";

export class GetOpenServiceRequestsUseCase implements IGetOpenServiceRequestsUseCase {
    constructor(
        private readonly _serviceRequestRepo: IServiceRequestRepository,
        private readonly _s3Service: S3Service
    ) { }

    async execute(
        workerId: string,
        workerLocation: [number, number],
        radiusMeters?: number
    ): Promise<ServiceRequest[]> {
        const requests = await this._serviceRequestRepo.findOpenNearby(
            workerLocation,
            workerId,
            radiusMeters
        );

        return Promise.all(requests.map(async (req) => {
            if (req.servicePhotos && req.servicePhotos.length > 0) {
                req.servicePhotos = await Promise.all(req.servicePhotos.map(async (photo) => {
                    return !photo.startsWith("http") ? await this._s3Service.getPresignedDownloadUrl(photo) : photo;
                }));
            }
            // Also sign client profile picture if it's a key
            if (req.client?.profilePictureUrl && !req.client.profilePictureUrl.startsWith("http")) {
                req.client.profilePictureUrl = await this._s3Service.getPresignedDownloadUrl(req.client.profilePictureUrl);
            }
            return req;
        }));
    }

}