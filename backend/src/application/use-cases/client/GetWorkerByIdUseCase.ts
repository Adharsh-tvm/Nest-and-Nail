import { Worker } from "../../../domain/entities/Worker";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IReviewRepository } from "../../../domain/repositories/IReviewRepository";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { S3Service } from "../../../infrastructure/adapters/S3service";
import { Role } from "../../../shared/enums/authEnums";

export interface IGetWorkerByIdUseCase {
  execute(id: string): Promise<Worker | null>;
}

export class GetWorkerByIdUseCase implements IGetWorkerByIdUseCase {
  constructor(
    private readonly _workerRepository: IWorkerRepository,
    private readonly _categoryRepository: ICategoryRepository,
    private readonly _reviewRepository: IReviewRepository,
    private readonly _userRepoFactory: IUserRepositoryFactory,
    private readonly _s3Service: S3Service
  ) { }

  async execute(id: string): Promise<Worker | null> {
    const worker = await this._workerRepository.findById(id);

    if (!worker) return null;

    // Resolve category IDs to category names
    if (worker.categories && worker.categories.length > 0) {
      const dbCategories = await this._categoryRepository.findByIds(worker.categories);
      worker.categories = dbCategories.map(cat => cat.name);
    }

    // Fetch reviews
    const reviews = await this._reviewRepository.findByWorkerId(id);
    const totalRatings = reviews.length;
    const totalSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const rating = totalRatings > 0 ? totalSum / totalRatings : 0;

    await this._workerRepository.updateById(id, { rating, totalRatings });
    worker.rating = rating;
    worker.totalRatings = totalRatings;

    // Fetch client names for reviews
    const reviewsWithClientNames = await Promise.all(reviews.map(async (review) => {
      try {
        const clientRepo = this._userRepoFactory.getRepository(Role.CLIENT);
        const workerRepo = this._userRepoFactory.getRepository(Role.WORKER);
        let client = await clientRepo.findById(review.clientId);
        client ??= await workerRepo.findById(review.clientId);

        return {
          reviewId: review.reviewId,
          serviceId: review.serviceId,
          clientId: review.clientId,
          workerId: review.workerId,
          rating: review.rating,
          review: review.review,
          createdAt: review.createdAt,
          clientName: client?.name ?? "Anonymous Client"
        };
      } catch (error) {
        console.error(`[GetWorkerById] Error fetching client for review:`, error);
        return {
          ...review,
          clientName: "Anonymous Client"
        };
      }
    }));

    worker.reviews = reviewsWithClientNames;

    if (worker.profilePictureUrl && !worker.profilePictureUrl.startsWith('http')) {
      try {
        const presignedUrl = await this._s3Service.getPresignedDownloadUrl(worker.profilePictureUrl);
        return { ...worker, profilePictureUrl: presignedUrl };
      } catch (error) {
        console.error(`Error generating presigned URL for worker ${worker.userId}:`, error);
      }
    }

    return worker;
  }
}
