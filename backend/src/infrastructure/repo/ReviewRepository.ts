import { IReviewRepository } from "../../domain/repositories/IReviewRepository";
import { Review } from "../../domain/entities/Review";
import { ReviewModel } from "../database/models/ReviewModel";

export class ReviewRepository implements IReviewRepository {

  async create(review: Review): Promise<Review> {
    const created = await ReviewModel.create(review);
    return created.toObject();
  }

  async findByServiceId(serviceId: string): Promise<Review | null> {
    return await ReviewModel.findOne({ serviceId }).lean().exec() as Review | null;
  }

  async findByWorkerId(workerId: string): Promise<Review[]> {
    return await ReviewModel.find({ workerId }).lean().exec() as Review[];
  }
}