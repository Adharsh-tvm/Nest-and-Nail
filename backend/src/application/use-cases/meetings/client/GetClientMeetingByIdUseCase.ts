import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IReviewRepository } from "../../../../domain/repositories/IReviewRepository";
import { IGetClientMeetingByIdUseCase } from "../../../interfaces/meetings/client/IGetClientMeetingByIdUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";
import { ServiceStatus } from "../../../../shared/enums/serviceEnums";
import { Service } from "../../../../domain/entities/Service";

interface IDetailedService extends Service {
  client?: {
    name: string;
    email: string;
    phone?: number;
    profilePictureUrl?: string;
  };
  worker?: {
    name: string;
    email?: string;
    rating?: number;
    profilePictureUrl?: string;
  };
}

export class GetClientMeetingByIdUseCase implements IGetClientMeetingByIdUseCase {

  constructor(
    private readonly serviceRepo: IServiceRepository,
    private readonly reviewRepo: IReviewRepository
  ) {}

  async execute(serviceId: string, clientId: string) {

    const service = await this.serviceRepo.findDetailedByServiceId(serviceId) as IDetailedService | null;

    if (!service) {
      throw new Error("Meeting not found");
    }

    // 🔒 Ownership check
    if (service.clientId !== clientId) {
      throw new Error("Unauthorized");
    }

    // 🎥 Ensure it's a video call
    if (service.category !== "VIDEO_CALL") {
      throw new Error("Not a meeting");
    }

    // A PENDING meeting has not been paid yet — treat it as non-existent
    if (service.status === ServiceStatus.PENDING) {
      throw new Error("Meeting not found");
    }

    const response = ServiceMapper.toResponse(service);

    if (service.status === ServiceStatus.COMPLETED) {
      const reviewObj = await this.reviewRepo.findByServiceId(serviceId);
      if (reviewObj) {
        response.review = {
          rating: reviewObj.rating,
          review: reviewObj.review,
          createdAt: reviewObj.createdAt
        };
      }
    }

    return response;
  }
}