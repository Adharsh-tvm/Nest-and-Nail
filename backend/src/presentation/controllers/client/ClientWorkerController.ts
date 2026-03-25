import { Request, Response } from "express";
import { IGetAvailableWorkersUseCase } from "../../../application/interfaces/client/IGetAvailableWorkersUseCase";
import { IGetWorkerByIdUseCase } from "../../../application/interfaces/client/IGetWorkerByIdUseCase";
import { IGetWorkerAvailabilityUseCase } from "../../../application/interfaces/client/IGetWorkerAvailabilityUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";

export class ClientController {

  constructor(
    private readonly getAvailableWorkersUseCase: IGetAvailableWorkersUseCase,
    private readonly getWorkerByIdUseCase: IGetWorkerByIdUseCase,
    private readonly getWorkerAvailabilityUseCase: IGetWorkerAvailabilityUseCase,
  ) { }

  getAvailableWorkers = async (req: Request, res: Response) => {

    const { category, lat, lng, search, isOnline } = req.query;

    const workers = await this.getAvailableWorkersUseCase.execute(
      category as string,
      Number(lat),
      Number(lng),
      search as string | undefined,
      isOnline === 'true' ? true : undefined
    );

    res.json({
      success: true,
      payload: workers
    });

  };

  getWorkerById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const worker = await this.getWorkerByIdUseCase.execute(id);

    if (!worker) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        success: false,
        message: "Worker not found"
      });
    }

    res.json({
      success: true,
      payload: worker
    });
  };

  getWorkerAvailability = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { date, startDate, endDate } = req.query;

    if (startDate && endDate) {
      const parsedStart = new Date(startDate as string);
      const parsedEnd = new Date(endDate as string);

      if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Invalid date format for startDate or endDate"
        });
      }

      if (this.getWorkerAvailabilityUseCase.executeBulk) {
        const result = await this.getWorkerAvailabilityUseCase.executeBulk(id, parsedStart, parsedEnd);
        return res.json({
          success: true,
          payload: result
        });
      }
    }

    if (!date) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Date is required if not using startDate/endDate"
      });
    }

    const parsedDate = new Date(date as string);

    if (isNaN(parsedDate.getTime())) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Invalid date format"
      });
    }

    const result = await this.getWorkerAvailabilityUseCase.execute(
      id,
      new Date(date as string)
    );

    res.json({
      success: true,
      payload: result
    });
  };

}