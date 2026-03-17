import { Worker } from "../../../domain/entities/Worker";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { S3Service } from "../../../infrastructure/adapters/S3service";

export interface IGetWorkerByIdUseCase {
  execute(id: string): Promise<Worker | null>;
}

export class GetWorkerByIdUseCase implements IGetWorkerByIdUseCase {
  constructor(
    private readonly workerRepository: IWorkerRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly s3Service: S3Service
  ) {}

  async execute(id: string): Promise<Worker | null> {
    const worker = await this.workerRepository.findById(id);

    if (!worker) return null;

    // Resolve category IDs to category names
    if (worker.categories && worker.categories.length > 0) {
      const dbCategories = await this.categoryRepository.findByIds(worker.categories);
      worker.categories = dbCategories.map(cat => cat.name);
    }

    if (worker.profilePictureUrl && !worker.profilePictureUrl.startsWith('http')) {
      try {
        const presignedUrl = await this.s3Service.getPresignedDownloadUrl(worker.profilePictureUrl);
        return { ...worker, profilePictureUrl: presignedUrl };
      } catch (error) {
        console.error(`Error generating presigned URL for worker ${worker.userId}:`, error);
      }
    }

    return worker;
  }
}
