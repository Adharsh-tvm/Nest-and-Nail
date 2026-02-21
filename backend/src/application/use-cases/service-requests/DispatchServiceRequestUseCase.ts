import { ServiceRequest } from "../../../domain/entities/ServiceRequest";
import { Worker } from "../../../domain/entities/Worker";
import { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { ServiceRequestStatus } from "../../../shared/enums/serviceEnums";

export class DispatchServiceRequestUseCase {

  constructor(
    private workerRepo: IWorkerRepository,
    private requestRepo: IServiceRequestRepository
  ) {}

  async execute(requestId: string): Promise<void> {

    const request = await this.requestRepo.findByRequestId(requestId);

    if (!request) return;

    if (request.status !== "OPEN") return;

    const workers = await this.workerRepo.findEligibleWorkers(
      request.category,
      request.location.coordinates,
      20000 
    );

    if (!workers.length) {
      await this.requestRepo.updateByRequestId(requestId, {
        status: ServiceRequestStatus.NO_WORKERS_AVAILABLE
      });
      return;
    }

    const rankedWorkers = this.rankWorkers(workers, request);

    for (const worker of rankedWorkers) {

      const reserved = await this.workerRepo.reserveWorker(worker.userId);

      if (!reserved) continue;

      await this.requestRepo.updateByRequestId(requestId, {
        reservedBy: worker.userId,
        reservationExpiresAt: new Date(Date.now() + 30000),
        triedWorkers: [
          ...(request.triedWorkers || []),
          worker.userId
        ]
      });

      return;
    }

    await this.requestRepo.updateByRequestId(requestId, {
      status: ServiceRequestStatus.NO_WORKERS_AVAILABLE
    });
  }

  private rankWorkers(workers: Worker[], request: ServiceRequest) {

    return workers
      .map(worker => {

        const distanceScore = 1 / (this.calculateDistance(worker, request) + 1);
        const ratingScore = (worker.rating || 0) / 5;
        const fairnessScore = 1 / ((worker.weeklyJobCount || 0) + 1);

        const score =
          (0.5 * distanceScore) +
          (0.3 * ratingScore) +
          (0.2 * fairnessScore);

        return { worker, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(item => item.worker);
  }

  private calculateDistance(worker: Worker, request: ServiceRequest) {
    const [lng1, lat1] = worker.address?.[0]?.location.coordinates || [0,0];
    const [lng2, lat2] = request.location.coordinates;

    return Math.sqrt(
      Math.pow(lat1 - lat2, 2) +
      Math.pow(lng1 - lng2, 2)
    );
  }
}