import { Request, Response } from "express";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { IGetAllConcernsUseCase } from "../../../application/interfaces/concern/IGetAllConcernsUseCase";
import { IResolveConcernUseCase } from "../../../application/interfaces/concern/IResolveConcernUseCase";

export class AdminConcernController {
  constructor(
    private readonly _getAllConcernsUseCase: IGetAllConcernsUseCase,
    private readonly _resolveConcernUseCase: IResolveConcernUseCase
  ) {}

  getAllConcerns = async (req: Request, res: Response) => {
    try {
      const query = {
        status: req.query.status as string,
        search: req.query.search as string,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10
      };

      const result = await this._getAllConcernsUseCase.execute(query);

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(result, "Concerns fetched successfully")
      );

    } catch {
      res.status(HttpStatusCode.INTERNAL_SERVER).json(
        ResponseHandler.error("Failed to fetch concerns")
      );
    }
  };

  resolveConcern = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { resolutionMessage } = req.body as { resolutionMessage: string };
      const adminId = req.user?.id;

      const result = await this._resolveConcernUseCase.execute(id, resolutionMessage, adminId);

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(result, "Concern resolved successfully")
      );
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to resolve concern";
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(msg)
      );
    }
  };
}