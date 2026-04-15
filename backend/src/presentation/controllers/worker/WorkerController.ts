import { Request, Response } from "express";
import { IBlockWorkerDatesUseCase } from "../../../application/interfaces/worker/profile/IBlockWorkerDatesUseCase";
import { IGetWorkerBlockedDatesUseCase } from "../../../application/interfaces/worker/profile/IGetWorkerBlockedDatesUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";

export class WorkerController {
  constructor(
    private readonly _blockWorkerDatesUseCase: IBlockWorkerDatesUseCase,
    private readonly _getWorkerBlockedDatesUseCase: IGetWorkerBlockedDatesUseCase
  ) {}

  blockDates = async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.id;
    const { dates, slotTypes } = req.body;

    if (!workerId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
      );
      return;
    }

    if (!dates || !Array.isArray(dates)) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, "Dates are required")
      );
      return;
    }

    await this._blockWorkerDatesUseCase.execute({
      workerId,
      dates: dates.map((d: string) => new Date(d)),
      slotTypes
    });

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(null, "Dates blocked successfully")
    );
  };

  getBlockedDates = async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.id;

    if (!workerId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
      );
      return;
    }

    const result = await this._getWorkerBlockedDatesUseCase.execute(workerId);

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(result, "Blocked dates fetched successfully")
    );
  };
}