import { IAddReviewUseCase } from "../../interfaces/review/IAddReviewUseCase";
import { IReviewRepository } from "../../../domain/repositories/IReviewRepository";
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { v4 as uuidv4 } from "uuid";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";

export class AddReviewUseCase implements IAddReviewUseCase {

  constructor(
    private readonly _reviewRepo: IReviewRepository,
    private readonly _serviceRepo: IServiceRepository,
    private readonly _workerRepo: IWorkerRepository
  ) {}

  async execute(
    serviceId: string,
    clientId: string,
    rating: number,
    review?: string
  ): Promise<void> {

    const service = await this._serviceRepo.findById(serviceId);

    if (!service) throw new Error("Service not found");

    if (service.clientId !== clientId)
      throw new Error("Unauthorized");

    if (service.status !== ServiceStatus.COMPLETED)
      throw new Error("Service not completed");

    // CHECK ALREADY REVIEWED
    const existing = await this._reviewRepo.findByServiceId(serviceId);
    if (existing) throw new Error("Review already submitted");

    const newReview = {
      reviewId: uuidv4(),
      serviceId,
      clientId,
      workerId: service.workerId,
      rating,
      review,
      createdAt: new Date()
    };

    await this._reviewRepo.create(newReview);

    // 🔥 UPDATE WORKER RATING
    const worker = await this._workerRepo.findById(service.workerId);
    if (!worker) throw new Error("Worker not found");

    const reviews = await this._reviewRepo.findByWorkerId(service.workerId);
    const totalRatings = reviews.length;
    const totalSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const newRating = totalRatings > 0 ? totalSum / totalRatings : 0;

    await this._workerRepo.updateById(worker.userId, {
      rating: newRating,
      totalRatings
    });
  }
}