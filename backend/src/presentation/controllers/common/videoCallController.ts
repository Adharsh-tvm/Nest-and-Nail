import { Request, Response } from "express";
import { IJoinVideoCallUseCase } from "../../../application/interfaces/meetings/IJoinVideoCallUseCase";
import { IEndVideoCallUseCase } from "../../../application/interfaces/meetings/IEndVideoCallUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";

export class VideoCallController {
  constructor(
    private joinUseCase: IJoinVideoCallUseCase,
    private endUseCase: IEndVideoCallUseCase
  ) {}

  joinCall = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { serviceId } = req.params;

    if (!userId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
      );
      return;
    }

    if (!serviceId) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, "serviceId is required")
      );
      return;
    }

    const result = await this.joinUseCase.execute(serviceId, userId);

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(result, "Joined video call successfully")
    );
  };

  endCall = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { serviceId } = req.params;

    if (!userId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED)
      );
      return;
    }

    if (!serviceId) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, "serviceId is required")
      );
      return;
    }

    const result = await this.endUseCase.execute(serviceId, userId);

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(result, "Call ended successfully")
    );
  };
}