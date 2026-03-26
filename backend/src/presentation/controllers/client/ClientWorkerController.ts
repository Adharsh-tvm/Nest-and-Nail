import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { IGetAvailableWorkersUseCase } from "../../../application/interfaces/client/IGetAvailableWorkersUseCase";
import { IGetWorkerByIdUseCase } from "../../../application/interfaces/client/IGetWorkerByIdUseCase";
import { IGetWorkerAvailabilityUseCase } from "../../../application/interfaces/client/IGetWorkerAvailabilityUseCase";

export class ClientController {
  constructor(
    private readonly getAvailableWorkersUseCase: IGetAvailableWorkersUseCase,
    private readonly getWorkerByIdUseCase: IGetWorkerByIdUseCase,
    private readonly getWorkerAvailabilityUseCase: IGetWorkerAvailabilityUseCase,
  ) {}

  getAvailableWorkers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, lat, lng, search, isOnline } = req.query;

      const workers = await this.getAvailableWorkersUseCase.execute(
        category as string,
        Number(lat),
        Number(lng),
        search as string | undefined,
        isOnline === "true" ? true : undefined
      );

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(workers, "Workers fetched successfully")
      );
    } catch (error) {
      next(error);
    }
  };

  getWorkerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const worker = await this.getWorkerByIdUseCase.execute(id);

      if (!worker) {
        return res.status(HttpStatusCode.NOT_FOUND).json(
          ResponseHandler.error("Worker not found")
        );
      }

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(worker, "Worker details fetched")
      );
    } catch (error) {
      next(error);
    }
  };

  getWorkerAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { date, startDate, endDate } = req.query;

      if (startDate && endDate) {
        const parsedStart = new Date(startDate as string);
        const parsedEnd = new Date(endDate as string);

        if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
          return res.status(HttpStatusCode.BAD_REQUEST).json(
            ResponseHandler.error("Invalid date format for startDate or endDate")
          );
        }

        if (this.getWorkerAvailabilityUseCase.executeBulk) {
          const result = await this.getWorkerAvailabilityUseCase.executeBulk(
            id,
            parsedStart,
            parsedEnd
          );

          return res.status(HttpStatusCode.OK).json(
            ResponseHandler.success(result, "Bulk availability fetched")
          );
        }
      }

      if (!date) {
        return res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error("Date is required if not using startDate/endDate")
        );
      }

      const parsedDate = new Date(date as string);

      if (isNaN(parsedDate.getTime())) {
        return res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error("Invalid date format")
        );
      }

      const result = await this.getWorkerAvailabilityUseCase.execute(
        id,
        parsedDate
      );

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(result, "Availability fetched")
      );
    } catch (error) {
      next(error);
    }
  };
}