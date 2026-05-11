import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IReviewRepository } from "../../../../domain/repositories/IReviewRepository";
import { IGetClientServiceByIdUseCase } from "../../../interfaces/service/client/IGetClientServiceByIdUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";
import { ServiceStatus } from "../../../../shared/enums/serviceEnums";

export class GetClientServiceByIdUseCase implements IGetClientServiceByIdUseCase {
  constructor(
    private readonly _serviceRepo: IServiceRepository,
    private readonly _reviewRepo: IReviewRepository
  ) { }

  async execute(serviceId: string, clientId: string) {
    const service = await this._serviceRepo.findById(serviceId);

    if (!service) {
      throw new Error("Service not found");
    }

    if (service.clientId !== clientId) {
      throw new Error("Unauthorized");
    }

    // A PENDING service has not been paid yet — treat it as non-existent
    if (service.status === ServiceStatus.PENDING) {
      throw new Error("Service not found");
    }

    const response = ServiceMapper.toResponse(service);

    if (service.status === ServiceStatus.COMPLETED) {
      const reviewObj = await this._reviewRepo.findByServiceId(serviceId);
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