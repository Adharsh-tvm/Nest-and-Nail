import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetClientMeetingByIdUseCase } from "../../../interfaces/meetings/client/IGetClientMeetingByIdUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";

export class GetClientMeetingByIdUseCase implements IGetClientMeetingByIdUseCase {

  constructor(private serviceRepo: IServiceRepository) {}

  async execute(serviceId: string, clientId: string) {

    const service = await this.serviceRepo.findDetailedByServiceId(serviceId);

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

    return ServiceMapper.toResponse(service);
  }
}