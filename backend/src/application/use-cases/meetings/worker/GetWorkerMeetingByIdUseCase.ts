import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetWorkerMeetingByIdUseCase } from "../../../interfaces/meetings/worker/IGetWorkerMeetingByIdUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";

export class GetWorkerMeetingByIdUseCase implements IGetWorkerMeetingByIdUseCase {

  constructor(private serviceRepo: IServiceRepository) {}

  async execute(serviceId: string, workerId: string) {

    const service = await this.serviceRepo.findById(serviceId);

    if (!service) {
      throw new Error("Meeting not found");
    }

    if (service.workerId !== workerId) {
      throw new Error("Unauthorized");
    }

    if (service.category !== "VIDEO_CALL") {
      throw new Error("Not a meeting");
    }

    return ServiceMapper.toResponse(service);
  }
}