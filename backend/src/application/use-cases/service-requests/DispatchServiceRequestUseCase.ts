import { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { ServiceRequestStatus } from "../../../shared/enums/serviceEnums";
import { IDispatchServiceRequestUseCase } from "../../interfaces/service-requests/IDispatchServiceRequestUseCase";


export class DispatchServiceRequestUseCase implements IDispatchServiceRequestUseCase {

  constructor(
    private readonly _workerRepo: IWorkerRepository,
    private readonly _requestRepo: IServiceRequestRepository
  ) { }

  async execute(requestId: string): Promise<void> {

    const request = await this._requestRepo.findByRequestId(requestId);
    if (!request) return;

    if (request.status !== ServiceRequestStatus.OPEN) return;

    const workers = await this._workerRepo.findEligibleWorkers(
      request.category,
      request.location.coordinates,
      20000
    );

    if (!workers.length) {
      await this._requestRepo.markNoWorkersAvailable(requestId);
      return;
    }

    for (const worker of workers) {

      const workerReserved = await this._workerRepo.reserveWorker(worker.userId);
      if (!workerReserved) continue;

      const expiresAt = new Date(Date.now() + 30000);

      const requestReserved = await this._requestRepo.reserveRequest(
        requestId,
        worker.userId,
        expiresAt
      );

      if (!requestReserved) {
        await this._workerRepo.releaseWorker(worker.userId);
        continue;
      }

      await this._requestRepo.addTriedWorker(requestId, worker.userId);

      return;
    }

    await this._requestRepo.markNoWorkersAvailable(requestId);
  }
}