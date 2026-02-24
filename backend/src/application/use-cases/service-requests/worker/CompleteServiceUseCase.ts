import { DomainError } from "../../../../domain/errors/DomainError";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IWorkerRepository } from "../../../../domain/repositories/IWorkerRepository";
import { ServiceRequestStatus } from "../../../../shared/enums/serviceEnums";
import { ICompleteServiceUseCase } from "../../../interfaces/service-requests/worker/ICompleteServiceUseCase";


export class CompleteServiceUseCase implements ICompleteServiceUseCase {

  constructor(
    private readonly serviceRepo: IServiceRepository,
    private readonly workerRepo: IWorkerRepository
  ) {}

  async execute(serviceId: string, workerId: string): Promise<void> {

    const service = await this.serviceRepo.findByServiceId(serviceId);

    if (!service) {
      throw new DomainError("Service not found", "SERVICE_NOT_FOUND");
    }

    if (service.workerId !== workerId) {
      throw new DomainError("Not authorized", "NOT_ALLOWED");
    }

    if (service.status !== ServiceRequestStatus.IN_PROGRESS) {
      throw new DomainError("Service not started", "INVALID_STATUS");
    }

    await this.serviceRepo.updateByServiceId(serviceId, {
      status: ServiceRequestStatus.COMPLETED,
      completedAt: new Date()
    });

    await this.workerRepo.updateById(workerId, {
      isAvailable: true,
      currentActiveRequestId: null
    });
  }
}