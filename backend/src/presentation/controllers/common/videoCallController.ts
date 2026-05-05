import { Request, Response } from "express";
import { IJoinVideoCallUseCase } from "../../../application/interfaces/meetings/IJoinVideoCallUseCase";
import { IEndVideoCallUseCase } from "../../../application/interfaces/meetings/IEndVideoCallUseCase";
import { ILeaveVideoCallUseCase } from "../../../application/interfaces/meetings/ILeaveVideoCallUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";

export class VideoCallController {
  constructor(
    private joinUseCase: IJoinVideoCallUseCase,
    private endUseCase: IEndVideoCallUseCase,
    private leaveUseCase: ILeaveVideoCallUseCase
  ) {}

  joinCall = async (req: Request, res: Response): Promise<void> => {
    try {
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
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER).json(
        ResponseHandler.error(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, error.message)
      );
    }
  };

  endCall = async (req: Request, res: Response): Promise<void> => {
    try {
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
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER).json(
        ResponseHandler.error(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, error.message)
      );
    }
  };

  leaveCall = async (req: Request, res: Response): Promise<void> => {
    try {
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

      const result = await this.leaveUseCase.execute(serviceId, userId);

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(result, "Left video call successfully")
      );
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER).json(
        ResponseHandler.error(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, error.message)
      );
    }
  };
}