import { Request, Response, NextFunction } from "express";
import { IGetWorkerServicesUseCase } from "../../../application/interfaces/service/worker/IGetWorkerServicesUseCase";
import { IGetWorkerServiceDetailsUseCase } from "../../../application/interfaces/service/worker/IGetWorkerServiceDetailsUseCase";
import { IGetActiveWorkerServiceUseCase } from "../../../application/interfaces/service/worker/IGetActiveWorkerServiceUseCase";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";

export class WorkerServiceController {
  constructor(
    private readonly _getWorkerServicesUseCase: IGetWorkerServicesUseCase,
    private readonly _getWorkerServiceDetailsUseCase: IGetWorkerServiceDetailsUseCase,
    private readonly _getActiveWorkerServiceUseCase: IGetActiveWorkerServiceUseCase
  ) {}

  // Fetch all services for a worker with optional status filter
  getWorkerServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workerId = (req as any).user?.id;

      // Validate worker authentication
      if (!workerId) {
        res.status(HttpStatusCode.UNAUTHORIZED).json(
          ResponseHandler.error("Unauthorized")
        );
        return;
      }

      const { status } = req.query;
      let parsedStatus: ServiceStatus | undefined;

      // Validate status query param
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

    } catch (error) {
      next(error);
    }
  };

  // Fetch details of a specific service for a worker
  getWorkerServiceDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workerId = (req as any).user?.id;
      const { serviceId } = req.params;

      // Validate worker authentication
      if (!workerId) {
        res.status(HttpStatusCode.UNAUTHORIZED).json(
          ResponseHandler.error("Unauthorized")
        );
        return;
      }

      // Validate serviceId param
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

    } catch (error) {
      next(error);
    }
  };

  // Fetch currently active service for a worker
  getActiveService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workerId = (req as any).user?.id;

      // Validate worker authentication
      if (!workerId) {
        res.status(HttpStatusCode.UNAUTHORIZED).json(
          ResponseHandler.error("Unauthorized")
        );
        return;
      }

      const service = await this._getActiveWorkerServiceUseCase.execute(workerId);

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(service, "Active service fetched successfully")
      );

    } catch (error) {
      next(error);
    }
  };
}