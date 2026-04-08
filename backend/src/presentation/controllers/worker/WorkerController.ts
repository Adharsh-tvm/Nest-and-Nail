import { Request, Response, NextFunction } from "express";
import { IBlockWorkerDatesUseCase } from "../../../application/interfaces/worker/profile/IBlockWorkerDatesUseCase";
import { IGetWorkerBlockedDatesUseCase } from "../../../application/interfaces/worker/profile/IGetWorkerBlockedDatesUseCase";

export class WorkerController {
  constructor(
    private readonly _blockWorkerDatesUseCase: IBlockWorkerDatesUseCase,
    private readonly _getWorkerBlockedDatesUseCase: IGetWorkerBlockedDatesUseCase
  ) { }

  blockDates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workerId = (req as any).user?.id;
      const { dates, slotTypes } = req.body;

      if (!workerId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!dates || !Array.isArray(dates)) {
        return res.status(400).json({ message: "Dates are required" });
      }

      await this._blockWorkerDatesUseCase.execute({
        workerId,
        dates: dates.map((d: string) => new Date(d)),
        slotTypes
      });

      res.status(200).json({
        success: true,
        message: "Dates blocked successfully"
      });

    } catch (error) {
      next(error);
    }
  };

  getBlockedDates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workerId = (req as any).user?.id;

    const result = await this._getWorkerBlockedDatesUseCase.execute(workerId);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};
}