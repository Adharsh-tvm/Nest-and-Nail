import { Request, Response } from "express";
import { IGetWorkerServicesUseCase } from "../../../application/interfaces/service/worker/IGetWorkerServicesUseCase";
import { IGetWorkerServiceDetailsUseCase } from "../../../application/interfaces/service/worker/IGetWorkerServiceDetailsUseCase";
import { IGetActiveWorkerServiceUseCase } from "../../../application/interfaces/service/worker/IGetActiveWorkerServiceUseCase";
import { IStartServiceUseCase } from "../../../application/interfaces/service/IStartServiceUseCase";
import { ICompleteServiceUseCase } from "../../../application/interfaces/service/ICompleteServiceUseCase";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";

export class WorkerServiceController {
  constructor(
    private readonly _getWorkerServicesUseCase: IGetWorkerServicesUseCase,
    private readonly _getWorkerServiceDetailsUseCase: IGetWorkerServiceDetailsUseCase,
    private readonly _getActiveWorkerServiceUseCase: IGetActiveWorkerServiceUseCase,
    private readonly _startServiceUseCase: IStartServiceUseCase,
    private readonly _completeServiceUseCase: ICompleteServiceUseCase,
  ) {}

  getWorkerServices = async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.id;

    if (!workerId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
      );
      return;
    }

    const { status } = req.query;
    let parsedStatus: ServiceStatus | undefined;

    if (typeof status === "string") {
      if (Object.values(ServiceStatus).includes(status as ServiceStatus)) {
        parsedStatus = status as ServiceStatus;
      } else {
        res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error("Invalid service status")
        );
        return;
      }
    }

    const services = await this._getWorkerServicesUseCase.execute(
      workerId,
      parsedStatus
    );

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(services, "Worker services fetched successfully")
    );
  };

  getWorkerServiceDetails = async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.id;
    const { serviceId } = req.params;

    if (!workerId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
      );
      return;
    }

    if (!serviceId) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error("Service ID is required")
      );
      return;
    }

    const service = await this._getWorkerServiceDetailsUseCase.execute(
      serviceId,
      workerId
    );

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(service, "Service details fetched successfully")
    );
  };

  getActiveService = async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.id;

    if (!workerId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
      );
      return;
    }

    const service = await this._getActiveWorkerServiceUseCase.execute(workerId);

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(service, "Active service fetched successfully")
    );
  };

  startService = async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.id;
    const { serviceId } = req.params;
    const { lat, lng } = req.body as { lat?: number; lng?: number };

    if (!workerId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
      );
      return;
    }

    if (!serviceId) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error("Service ID is required")
      );
      return;
    }

    if (!lat || !lng) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error("Location required")
      );
      return;
    }

    const result = await this._startServiceUseCase.execute(
      serviceId,
      workerId,
      lat,
      lng
    );

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(result, "Service started successfully")
    );
  };

  completeService = async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.id;
    const { serviceId } = req.params;

    if (!workerId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
      );
      return;
    }

    if (!serviceId) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error("Service ID is required")
      );
      return;
    }

    const result = await this._completeServiceUseCase.execute(serviceId, workerId);

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(result, "Service completed successfully")
    );
  };
}