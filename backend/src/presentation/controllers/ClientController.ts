import { Request, Response } from "express";
import { IGetAvailableWorkersUseCase } from "../../application/interfaces/client/IGetAvailableWorkersUseCase";
import { IGetWorkerByIdUseCase } from "../../application/interfaces/client/IGetWorkerByIdUseCase";
import { IGetWorkerAvailabilityUseCase } from "../../application/interfaces/client/IGetWorkerAvailabilityUseCase";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { IBookWorkerUseCase } from "../../domain/repositories/IBookWorkerUseCase";

export class ClientController {

  constructor(
    private readonly getAvailableWorkersUseCase: IGetAvailableWorkersUseCase,
    private readonly getWorkerByIdUseCase: IGetWorkerByIdUseCase,
    private readonly getWorkerAvailabilityUseCase: IGetWorkerAvailabilityUseCase,
    private readonly bookWorkerUseCase: IBookWorkerUseCase
  ) { }

  getAvailableWorkers = async (req: Request, res: Response) => {

    const { category, lat, lng, search, isOnline } = req.query;

    const workers = await this.getAvailableWorkersUseCase.execute(
      category as string,
      Number(lat),
      Number(lng),
      search as string | undefined,
      isOnline === 'true' ? true : undefined  // only filter if explicitly "true"
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
    const { date } = req.query;

    if (!date) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Date is required"
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

  bookWorker = async (req: Request, res: Response) => {

    const { workerId, category, date, slotType } = req.body;

    const clientId = (req as any).user.userId;

    const result = await this.bookWorkerUseCase.execute({
      clientId,
      workerId,
      category,
      scheduledDate: new Date(date),
      slotType,

      location: {
        type: "Point",
        coordinates: [0, 0] // replace later
      }
    });

    res.json({
      success: true,
      payload: result
    });
  };
}