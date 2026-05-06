import { Request, Response } from "express";
import { ICreateConcernUseCase } from "../../../application/interfaces/concern/ICreateConcernUseCase";
import { IGetUserConcernsUseCase } from "../../../application/interfaces/concern/IGetUserConcernsUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { concernBy } from "../../../shared/enums/concernEnums";

export class ConcernController {
  constructor(
    private readonly _createConcernUseCase: ICreateConcernUseCase,
    private readonly _getUserConcernsUseCase: IGetUserConcernsUseCase
  ) {}

  createConcern = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const { serviceId, message } = req.body;
      const role = req.user.role?.toUpperCase() as concernBy;

      if (!userId) {
        return res.status(HttpStatusCode.UNAUTHORIZED)
          .json(ResponseHandler.error("Unauthorized"));
      }

      const files = req.files as any[] | undefined;

      const result = await this._createConcernUseCase.execute(
        serviceId,
        userId,
        role,
        message,
        files
      );

      res.status(HttpStatusCode.CREATED).json(
        ResponseHandler.success(result, "Concern raised successfully")
      );

    } catch (error: any) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(error.message)
      );
    }
  };

  getMyConcerns = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const result = await this._getUserConcernsUseCase.execute(userId);

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(result, "Concerns fetched")
    );
  };
}