import { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { ServiceRequestStatus } from "../../../shared/enums/serviceEnums";
import { IDispatchServiceRequestUseCase } from "../../interfaces/service-requests/IDispatchServiceRequestUseCase";


export class DispatchServiceRequestUseCase implements IDispatchServiceRequestUseCase{

  constructor(
    private readonly workerRepo: IWorkerRepository,
    private readonly requestRepo: IServiceRequestRepository
  ) {}

  async execute(requestId: string): Promise<void> {

    const request = await this.requestRepo.findByRequestId(requestId);
    if (!request) return;

    if (request.status !== ServiceRequestStatus.OPEN) return;

    const workers = await this.workerRepo.findEligibleWorkers(
      request.category,
      request.location.coordinates,
      20000
    );

    if (!workers.length) {
      await this.requestRepo.markNoWorkersAvailable(requestId);
      return;
    }

    for (const worker of workers) {

      const workerReserved = await this.workerRepo.reserveWorker(worker.userId);
      if (!workerReserved) continue;

      const expiresAt = new Date(Date.now() + 30000);

      const requestReserved = await this.requestRepo.reserveRequest(
        requestId,
        worker.userId,
        expiresAt
      );

      if (!requestReserved) {
        await this.workerRepo.releaseWorker(worker.userId);
        continue;
      }

      await this.requestRepo.addTriedWorker(requestId, worker.userId);

      return;
    }

    await this.requestRepo.markNoWorkersAvailable(requestId);
  }
}