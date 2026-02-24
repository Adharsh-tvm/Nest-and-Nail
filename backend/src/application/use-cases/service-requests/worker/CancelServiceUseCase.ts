import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IWorkerRepository } from "../../../../domain/repositories/IWorkerRepository";
import { DomainError } from "../../../../domain/errors/DomainError";
import { ServiceRequestStatus } from "../../../../shared/enums/serviceEnums";
import { ICancelServiceUseCase } from "../../../interfaces/service-requests/worker/ICancelServiceUseCase";

export class CancelServiceUseCase implements ICancelServiceUseCase {

  constructor(
    private readonly serviceRepo: IServiceRepository,
    private readonly workerRepo: IWorkerRepository
  ) {}

  async execute(serviceId: string, reason: string): Promise<void> {

    const service = await this.serviceRepo.findByServiceId(serviceId);

    if (!service) {
      throw new DomainError("Service not found", "SERVICE_NOT_FOUND");
    }

    if (
      service.status === ServiceRequestStatus.COMPLETED ||
      service.status === ServiceRequestStatus.CANCELLED
    ) {
      throw new DomainError("Service cannot be cancelled", "INVALID_STATUS");
    }

    await this.serviceRepo.updateByServiceId(serviceId, {
      status: ServiceRequestStatus.CANCELLED,
      cancelledAt: new Date(),
      cancellationReason: reason
    });

    await this.workerRepo.updateById(service.workerId, {
      isAvailable: true,
      currentActiveRequestId: null
    });
  }
}