import { IServiceRequestRepository } from "../../../../domain/repositories/IServiceRequestRepository";
import { IWorkerRepository } from "../../../../domain/repositories/IWorkerRepository";
import { ServiceRequestStatus } from "../../../../shared/enums/serviceEnums";
import { IDispatchServiceRequestUseCase } from "../../../interfaces/service-requests/IDispatchServiceRequestUseCase";
import { IHandleExpiredReservationsUseCase } from "../../../interfaces/service-requests/worker/IHandleExpiredReservationsUseCase";

export class HandleExpiredReservationsUseCase implements IHandleExpiredReservationsUseCase {

  constructor(
    private readonly _requestRepo: IServiceRequestRepository,
    private readonly _workerRepo: IWorkerRepository,
    private readonly _dispatchUseCase: IDispatchServiceRequestUseCase
  ) {}

  async execute(): Promise<void> {

    const expiredRequests =
      await this._requestRepo.findExpiredReservations(new Date());

    for (const request of expiredRequests) {

      if (!request.reservedBy) continue;

      // Release worker
      await this._workerRepo.releaseWorker(request.reservedBy);

      // Reset request
      await this._requestRepo.updateByRequestId(request.requestId, {
        status: ServiceRequestStatus.OPEN,
        reservedBy: undefined,
        reservationExpiresAt: undefined
      });

      // Try dispatch again
      await this._dispatchUseCase.execute(request.requestId);
    }
  }
}