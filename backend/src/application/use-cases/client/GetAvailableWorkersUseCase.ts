import { Worker } from "../../../domain/entities/Worker";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { IGetAvailableWorkersUseCase } from "../../interfaces/client/IGetAvailableWorkersUseCase";
import { S3Service } from "../../../infrastructure/adapters/S3service";

export class GetAvailableWorkersUseCase implements IGetAvailableWorkersUseCase {

  constructor(
    private readonly _workerRepository: IWorkerRepository,
    private readonly _s3Service: S3Service
  ) { }

  async execute(
    categoryId?: string,
    lat?: number,
    lng?: number,
    search?: string,
    isOnline?: boolean
  ): Promise<Worker[]> {

    const workers = await this._workerRepository.findAvailableWorkers(
      categoryId,
      lat,
      lng,
      search,
      isOnline
    );

    // Map through workers and generate presigned URLs for their profile pictures
    const workersWithPresignedUrls = await Promise.all(workers.map(async (worker) => {
      if (worker.profilePictureUrl && !worker.profilePictureUrl.startsWith('http')) {
        try {
          const presignedUrl = await this._s3Service.getPresignedDownloadUrl(worker.profilePictureUrl);
          return { ...worker, profilePictureUrl: presignedUrl };
        } catch (error) {
          console.error(`Error generating presigned URL for worker ${worker.userId}:`, error);
          return worker;
        }
      }
      return worker;
    }));

    return workersWithPresignedUrls;
  }
}