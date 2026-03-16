import { Request, Response } from "express";
import { GetAvailableWorkersUseCase } from "../../application/use-cases/client/GetAvailableWorkersUseCase";
import { IGetAvailableWorkersUseCase } from "../../application/interfaces/client/IGetAvailableWorkersUseCase";
import { IGetWorkerByIdUseCase } from "../../application/interfaces/client/IGetWorkerByIdUseCase";

export class ClientController {

  constructor(
    private readonly getAvailableWorkersUseCase: IGetAvailableWorkersUseCase,
    private readonly getWorkerByIdUseCase: IGetWorkerByIdUseCase
  ) {}

  getAvailableWorkers = async (req: Request, res: Response) => {

    const { category, lat, lng } = req.query;

    const workers = await this.getAvailableWorkersUseCase.execute(
      category as string,
      Number(lat),
      Number(lng)
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
      return res.status(404).json({
        success: false,
        message: "Worker not found"
      });
    }

    res.json({
      success: true,
      payload: worker
    });
  };

}