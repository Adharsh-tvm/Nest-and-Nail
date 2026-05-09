import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetWorkerMeetingByIdUseCase } from "../../../interfaces/meetings/worker/IGetWorkerMeetingByIdUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";
import { ServiceStatus } from "../../../../shared/enums/serviceEnums";

interface IDetailedService {
  workerId: string;
  category: string;
  status: ServiceStatus;
  [key: string]: unknown;
}

export class GetWorkerMeetingByIdUseCase implements IGetWorkerMeetingByIdUseCase {

  constructor(private serviceRepo: IServiceRepository) {}

  async execute(serviceId: string, workerId: string) {

    const service = await this.serviceRepo.findDetailedByServiceId(serviceId) as unknown as IDetailedService;

    if (!service) {
      throw new Error("Meeting not found");
    }

    if (service.workerId !== workerId) {
      throw new Error("Unauthorized");
    }

    if (service.category !== "VIDEO_CALL") {
      throw new Error("Not a meeting");
    }

    if (service.status === ServiceStatus.PENDING) {
      throw new Error("Meeting not found");
    }

    return ServiceMapper.toResponse(service);
  }
}