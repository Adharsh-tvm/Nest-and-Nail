import { Request, Response } from "express";
import { IBlockWorkerDatesUseCase } from "../../../application/interfaces/worker/profile/IBlockWorkerDatesUseCase";
import { IGetWorkerBlockedDatesUseCase } from "../../../application/interfaces/worker/profile/IGetWorkerBlockedDatesUseCase";
import { IGetWorkerDashboardDataUseCase } from "../../../application/interfaces/worker/profile/IGetWorkerDashboardDataUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";

import { SlotType } from "../../../shared/enums/slotEnums";

export class WorkerController {
  constructor(
    private readonly _blockWorkerDatesUseCase: IBlockWorkerDatesUseCase,
    private readonly _getWorkerBlockedDatesUseCase: IGetWorkerBlockedDatesUseCase,
    private readonly _getWorkerDashboardDataUseCase: IGetWorkerDashboardDataUseCase
  ) {}

  blockDates = async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.id;
    const { dates, slotTypes } = req.body as { dates?: unknown; slotTypes?: SlotType[] };

    if (!workerId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
      );
      return;
    }

    if (!dates || !Array.isArray(dates)) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(RESPONSE_MESSAGES.DATES_REQUIRED)
      );
      return;
    }

    await this._blockWorkerDatesUseCase.execute({
      workerId,
      dates: (dates as string[]).map((d: string) => new Date(d)),
      slotTypes
    });

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(null, RESPONSE_MESSAGES.DATES_BLOCKED)
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
      ResponseHandler.success(result, RESPONSE_MESSAGES.BLOCKED_DATES_FETCHED)
    );
  };

  getDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
      const workerId = req.user?.id;
      const months = req.query.months ? parseInt(req.query.months as string) : 6;

      if (!workerId) {
        res.status(HttpStatusCode.UNAUTHORIZED).json(
          ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
        );
        return;
      }
      const data = await this._getWorkerDashboardDataUseCase.execute(workerId, months);
      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(data, RESPONSE_MESSAGES.DASHBOARD_DATA_FETCHED)
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      res.status(HttpStatusCode.INTERNAL_SERVER).json(
        ResponseHandler.error(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, message)
      );
    }
  };
}