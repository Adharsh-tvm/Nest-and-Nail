import { ServiceRequest } from "../../../../domain/entities/ServiceRequest";
import { IServiceRequestRepository } from "../../../../domain/repositories/IServiceRequestRepository";
import { IGetMyServiceRequestsUseCase } from "../../../interfaces/service-requests/client/IGetMyServiceRequestsUseCase";

import { S3Service } from "../../../../infrastructure/adapters/S3service";

export class GetMyServiceRequestsUseCase implements IGetMyServiceRequestsUseCase {

  constructor(
    private readonly _repo: IServiceRequestRepository,
    private readonly _s3Service: S3Service
  ) { }

  async execute(clientId: string): Promise<ServiceRequest[]> {
    const requests = await this._repo.findByClientId(clientId);

    return Promise.all(requests.map(async (req) => {
      if (req.servicePhotos && req.servicePhotos.length > 0) {
        req.servicePhotos = await Promise.all(req.servicePhotos.map(async (photo) => {
          return !photo.startsWith("http") ? await this._s3Service.getPresignedDownloadUrl(photo) : photo;
        }));
      }
      return req;
    }));
  }
}
