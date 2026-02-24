import { DomainError } from "../../../../domain/errors/DomainError";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { ServiceRequestStatus } from "../../../../shared/enums/serviceEnums";
import { IStartServiceUseCase } from "../../../interfaces/service-requests/worker/IStartServiceUseCase";


export class StartServiceUseCase implements IStartServiceUseCase {

  constructor(
    private readonly serviceRepo: IServiceRepository
  ) {}

  async execute(serviceId: string, workerId: string): Promise<void> {

    const service = await this.serviceRepo.findByServiceId(serviceId);

    if (!service) {
      throw new DomainError("Service not found", "SERVICE_NOT_FOUND");
    }

    if (service.workerId !== workerId) {
      throw new DomainError("Not authorized", "NOT_ALLOWED");
    }

    if (service.status !== ServiceRequestStatus.CONFIRMED) {
      throw new DomainError("Service not confirmed", "INVALID_STATUS");
    }

    await this.serviceRepo.updateByServiceId(serviceId, {
      status: ServiceRequestStatus.IN_PROGRESS,
      startedAt: new Date()
    });
  }
}