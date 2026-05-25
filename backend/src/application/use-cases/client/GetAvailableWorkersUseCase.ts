import { Worker } from "../../../domain/entities/Worker";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { IReviewRepository } from "../../../domain/repositories/IReviewRepository";
import { IGetAvailableWorkersUseCase } from "../../interfaces/client/IGetAvailableWorkersUseCase";
import { S3Service } from "../../../infrastructure/adapters/S3service";

export class GetAvailableWorkersUseCase implements IGetAvailableWorkersUseCase {

  constructor(
    private readonly _workerRepository: IWorkerRepository,
    private readonly _reviewRepository: IReviewRepository,
    private readonly _s3Service: S3Service
  ) { }

  async execute(
    categoryId?: string,
    lat?: number,
    lng?: number,
    search?: string,
    isOnline?: boolean,
    page?: number,
    limit?: number,
    sortBy?: string
  ): Promise<{ workers: Worker[]; total: number }> {

    const { workers, total } = await this._workerRepository.findAvailableWorkers(
      categoryId,
      lat,
      lng,
      search,
      isOnline,
      page,
      limit,
      sortBy
    );

    // Map through workers, calculate/save reviews, and generate presigned URLs for their profile pictures
    const workersWithCalculatedReviews = await Promise.all(workers.map(async (worker) => {
      // Calculate and save reviews
      const reviews = await this._reviewRepository.findByWorkerId(worker.userId);
      const totalRatings = reviews.length;
      const totalSum = reviews.reduce((sum, r) => sum + r.rating, 0);
      const rating = totalRatings > 0 ? totalSum / totalRatings : 0;

      await this._workerRepository.updateById(worker.userId, { rating, totalRatings });

      let profilePictureUrl = worker.profilePictureUrl;
      if (profilePictureUrl && !profilePictureUrl.startsWith('http')) {
        try {
          profilePictureUrl = await this._s3Service.getPresignedDownloadUrl(profilePictureUrl);
        } catch (error) {
          console.error(`Error generating presigned URL for worker ${worker.userId}:`, error);
        }
      }

      return {
        ...worker,
        rating,
        totalRatings,
        profilePictureUrl
      };
    }));

    return { workers: workersWithCalculatedReviews, total };
  }
}