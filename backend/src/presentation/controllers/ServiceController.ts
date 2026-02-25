import { Request, Response } from "express";
import { IAcceptServiceRequestUseCase } from "../../application/interfaces/service-requests/worker/IAcceptServiceRequestUseCase";
import { ICancelServiceUseCase } from "../../application/interfaces/service-requests/worker/ICancelServiceUseCase";
import { ICompleteServiceUseCase } from "../../application/interfaces/service-requests/worker/ICompleteServiceUseCase";
import { IStartServiceUseCase } from "../../application/interfaces/service-requests/worker/IStartServiceUseCase";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { ResponseHandler } from "../../shared/responses/ApiResponse";
import { IServiceController } from "../interfaces/IServiceController";


export class ServiceController implements IServiceController {

  constructor(
    private readonly _acceptServiceRequestUseCase: IAcceptServiceRequestUseCase,
    private readonly _startServiceUseCase: IStartServiceUseCase,
    private readonly _completeServiceUseCase: ICompleteServiceUseCase,
    private readonly _cancelServiceUseCase: ICancelServiceUseCase
  ) {}

  acceptRequest = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { requestId } = req.params;
      const workerId = req.user.id;

      await this._acceptServiceRequestUseCase.execute(requestId, workerId);

      return res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(null, "Service request accepted")
      );
    } catch (error: any) {
      return res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error("Accept failed", error.message)
      );
    }
  };

  startService = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { serviceId } = req.params;
      const workerId = req.user.id;

      await this._startServiceUseCase.execute(serviceId, workerId);

      return res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(null, "Service started")
      );
    } catch (error: any) {
      return res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error("Start failed", error.message)
      );
    }
  };

  completeService = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { serviceId } = req.params;
      const workerId = req.user.id;

      await this._completeServiceUseCase.execute(serviceId, workerId);

      return res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(null, "Service completed")
      );
    } catch (error: any) {
      return res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error("Complete failed", error.message)
      );
    }
  };

  cancelService = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { serviceId } = req.params;
      const { reason } = req.body;

      await this._cancelServiceUseCase.execute(serviceId, reason);

      return res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(null, "Service cancelled")
      );
    } catch (error: any) {
      return res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error("Cancel failed", error.message)
      );
    }
  };
}