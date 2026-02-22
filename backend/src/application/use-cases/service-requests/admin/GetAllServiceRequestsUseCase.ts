import { IServiceRequestRepository } from "../../../../domain/repositories/IServiceRequestRepository";
import { ServiceRequest } from "../../../../domain/entities/ServiceRequest";
import { IGetAllServiceRequestsUseCase } from "../../../interfaces/service-requests/admin/IGetAllServiceRequestsUseCase";

import { S3Service } from "../../../../infrastructure/adapters/S3service";

export class GetAllServiceRequestsUseCase
    implements IGetAllServiceRequestsUseCase {

    constructor(
        private readonly _serviceRequestRepo: IServiceRequestRepository,
        private readonly _s3Service: S3Service
    ) { }

    async execute(): Promise<ServiceRequest[]> {
        const requests = await this._serviceRequestRepo.findAll();

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
