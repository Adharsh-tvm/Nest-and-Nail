import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetClientMeetingByIdUseCase } from "../../../interfaces/meetings/client/IGetClientMeetingByIdUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";
import { ServiceStatus } from "../../../../shared/enums/serviceEnums";

interface IDetailedService {
  clientId: string;
  category: string;
  status: ServiceStatus;
  [key: string]: unknown;
}

export class GetClientMeetingByIdUseCase implements IGetClientMeetingByIdUseCase {

  constructor(private serviceRepo: IServiceRepository) {}

  async execute(serviceId: string, clientId: string) {

    const service = await this.serviceRepo.findDetailedByServiceId(serviceId) as unknown as IDetailedService;

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

    return ServiceMapper.toResponse(service);
  }
}