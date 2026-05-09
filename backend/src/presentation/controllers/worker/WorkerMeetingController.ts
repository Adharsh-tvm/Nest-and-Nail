import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { IGetWorkerScheduledMeetingsUseCase } from "../../../application/interfaces/meetings/worker/IGetWorkerScheduledMeetingsUseCase";
import { IGetWorkerMeetingsHistoryUseCase } from "../../../application/interfaces/meetings/worker/IGetWorkerMeetingsUseCase";
import { IGetWorkerMeetingByIdUseCase } from "../../../application/interfaces/meetings/worker/IGetWorkerMeetingByIdUseCase";


export class WorkerMeetingsController {
    constructor(
        private readonly _getScheduledUseCase: IGetWorkerScheduledMeetingsUseCase,
        private readonly _getHistoryUseCase: IGetWorkerMeetingsHistoryUseCase,
        private readonly _getMeetingByIdUseCase: IGetWorkerMeetingByIdUseCase,
    ) { }

    getScheduledMeetings = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const workerId = req.user?.id;

            if (!workerId) {
                return res
                    .status(HttpStatusCode.UNAUTHORIZED)
                    .json(ResponseHandler.error("Unauthorized"));
            }

            const result = await this._getScheduledUseCase.execute(workerId);

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, "Scheduled video calls fetched")
            );
        } catch (error) {
            next(error);
        }
    };

    getMeetingsHistory = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const workerId = req.user?.id;

            if (!workerId) {
                return res
                    .status(HttpStatusCode.UNAUTHORIZED)
                    .json(ResponseHandler.error("Unauthorized"));
            }

            const result = await this._getHistoryUseCase.execute(workerId);

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, "Video call history fetched")
            );
        } catch (error) {
            next(error);
        }
    };

    getMeetingById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const workerId = req.user?.id;

            if (!workerId) {
                return res
                    .status(HttpStatusCode.UNAUTHORIZED)
                    .json(ResponseHandler.error("Unauthorized"));
            }
            const { serviceId } = req.params;

            const result = await this._getMeetingByIdUseCase.execute(
                serviceId,
                workerId
            );

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, "Meeting fetched")
            );
        } catch (error) {
            next(error);
        }
    };
}