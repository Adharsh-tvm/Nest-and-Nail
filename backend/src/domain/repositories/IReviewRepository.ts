import { Review } from "../entities/Review";

export interface IReviewRepository {
  create(review: Review): Promise<Review>;

  findByServiceId(serviceId: string): Promise<Review | null>;

  findByWorkerId(workerId: string): Promise<Review[]>;
}