import { ServiceRequest } from "../../../domain/entities/ServiceRequest";
import { Worker } from "../../../domain/entities/Worker";
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

    const filteredWorkers = workers.filter(
      w => !request.triedWorkers?.includes(w.userId)
    );

    if (!filteredWorkers.length) {
      await this._requestRepo.markNoWorkersAvailable(requestId);
      return;
    }

    const rankedWorkers = this.rankWorkers(filteredWorkers, request);

    for (const worker of rankedWorkers) {

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


  private calculateDistance(
    coords1: [number, number],
    coords2: [number, number]
  ): number {

    const [lng1, lat1] = coords1;
    const [lng2, lat2] = coords2;

    return Math.sqrt(
      Math.pow(lat1 - lat2, 2) +
      Math.pow(lng1 - lng2, 2)
    );
  }

  private rankWorkers(workers: Worker[], request: ServiceRequest): Worker[] {

    return workers
      .map(worker => {

        const workerCoords = worker.address?.[0]?.location?.coordinates;
        if (!workerCoords) return { worker, score: 0 };

        const distance = this.calculateDistance(
          workerCoords,
          request.location.coordinates
        );

        const distanceScore = 1 / (distance + 1);
        const ratingScore = (worker.rating ?? 0) / 5;
        const fairnessScore = 1 / ((worker.weeklyJobCount ?? 0) + 1);

        const score =
          (0.5 * distanceScore) +
          (0.3 * ratingScore) +
          (0.2 * fairnessScore);

        return { worker, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(x => x.worker);
  }
}