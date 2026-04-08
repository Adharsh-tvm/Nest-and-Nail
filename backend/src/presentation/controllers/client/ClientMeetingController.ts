import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { IGetClientScheduledMeetingsUseCase } from "../../../application/interfaces/meetings/client/IGetClientScheduledVideoCallsUseCase";
import { IGetClientMeetingsHistoryUseCase } from "../../../application/interfaces/meetings/client/IGetClientVideoCallHistoryUseCase";
import { IGetClientMeetingByIdUseCase } from "../../../application/interfaces/meetings/client/IGetClientMeetingByIdUseCase";
import { ICreateVideoCallUseCase } from "../../../application/interfaces/meetings/client/ICreateVideoCallUseCase";


export class ClientMeetingsController {
    constructor(
        private readonly _getScheduledUseCase: IGetClientScheduledMeetingsUseCase,
        private readonly _getHistoryUseCase: IGetClientMeetingsHistoryUseCase,
        private readonly _getMeetingByIdUseCase: IGetClientMeetingByIdUseCase,
        private readonly _createVideoCallUseCase: ICreateVideoCallUseCase
    ) { }

    getScheduledMeetings = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const clientId = (req as any).user?.id;

            if (!clientId) {
                return res
                    .status(HttpStatusCode.UNAUTHORIZED)
                    .json(ResponseHandler.error("Unauthorized"));
            }

            const result = await this._getScheduledUseCase.execute(clientId);

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
            const clientId = (req as any).user?.id;

            if (!clientId) {
                return res
                    .status(HttpStatusCode.UNAUTHORIZED)
                    .json(ResponseHandler.error("Unauthorized"));
            }

            const result = await this._getHistoryUseCase.execute(clientId);

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, "Video call history fetched")
            );
        } catch (error) {
            next(error);
        }
    };

    getMeetingById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clientId = req.user.id;
            const { serviceId } = req.params;

            const result = await this._getMeetingByIdUseCase.execute(
                serviceId,
                clientId
            );

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, "Meeting fetched")
            );
        } catch (error) {
            next(error);
        }
    };

    createVideoCall = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clientId = req.user.id;
            const { serviceId } = req.params;
            const { startTime, endTime } = req.body;

            const result = await this._createVideoCallUseCase.execute(
                serviceId,
                clientId,
                new Date(startTime),
                new Date(endTime)
            );

            res.status(200).json(
                ResponseHandler.success(result, "Video call scheduled successfully")
            );

        } catch (error) {
            next(error);
        }
    };
}