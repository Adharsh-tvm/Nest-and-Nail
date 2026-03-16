import { Request, Response } from "express";
import { GetAvailableWorkersUseCase } from "../../application/use-cases/client/GetAvailableWorkersUseCase";
import { IGetAvailableWorkersUseCase } from "../../application/interfaces/client/IGetAvailableWorkersUseCase";

export class ClientController {

  constructor(
    private readonly getAvailableWorkersUseCase: IGetAvailableWorkersUseCase
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

}