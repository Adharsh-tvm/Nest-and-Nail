import { Worker } from "../../../domain/entities/Worker";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { IGetAvailableWorkersUseCase } from "../../interfaces/client/IGetAvailableWorkersUseCase";
import { S3Service } from "../../../infrastructure/adapters/S3service";

export class GetAvailableWorkersUseCase implements IGetAvailableWorkersUseCase{

  constructor(
    private readonly workerRepository: IWorkerRepository,
    private readonly s3Service: S3Service
  ) {}

  async execute(
    categoryId?: string,
    lat?: number,
    lng?: number
  ): Promise<Worker[]> {

    const workers = await this.workerRepository.findAvailableWorkers(
      categoryId,
      lat,
      lng
    );

    // Map through workers and generate presigned URLs for their profile pictures
    const workersWithPresignedUrls = await Promise.all(workers.map(async (worker) => {
      if (worker.profilePictureUrl && !worker.profilePictureUrl.startsWith('http')) {
        try {
          const presignedUrl = await this.s3Service.getPresignedDownloadUrl(worker.profilePictureUrl);
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