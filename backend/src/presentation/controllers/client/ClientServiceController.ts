import { NextFunction, Request, Response } from "express";
import { IGetClientServiceHistoryUseCase } from "../../../application/interfaces/service/client/IGetClientServiceHistoryUseCase";
import { IGetClientServiceByIdUseCase } from "../../../application/interfaces/service/client/IGetClientServiceByIdUseCase";
import { IGetClientOngoingServicesUseCase } from "../../../application/interfaces/service/client/IGetClientOngoingServicesUseCase";
import { IBookWorkerUseCase } from "../../../domain/repositories/IBookWorkerUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";

export class ClientServiceController {
    constructor(
        private readonly getHistoryUseCase: IGetClientServiceHistoryUseCase,
        private readonly getByIdUseCase: IGetClientServiceByIdUseCase,
        private readonly getOngoingUseCase: IGetClientOngoingServicesUseCase,
        private readonly bookWorkerUseCase: IBookWorkerUseCase
    ) { }

    bookWorker = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                workerId,
                category,
                date,
                selectedSlots,
                slotType,
                numberOfDays,
                title,
                description,
            } = req.body;

            const clientId = (req as any).user?.id || (req as any).user?._id;

            if (!clientId) {
                return res
                    .status(HttpStatusCode.UNAUTHORIZED)
                    .json(ResponseHandler.error("Unauthorized"));
            }

            const scheduledDate = new Date(date);

            const parsedSelectedSlots = selectedSlots
                ? selectedSlots.map((s: any) => ({
                    date: new Date(s.date),
                    slotType: s.slotType,
                }))
                : [{ date: scheduledDate, slotType }];

            const result = await this.bookWorkerUseCase.execute({
                clientId,
                workerId,
                category,
                scheduledDate,
                selectedSlots: parsedSelectedSlots,
                numberOfDays,
                title,
                description,
                location: {
                    type: "Point",
                    coordinates: [0, 0],
                },
            });

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, "Worker booked successfully")
            );
        } catch (error) {
            next(error); // 🔥 send to your errorHandler
        }
    };

    getServiceHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clientId = (req as any).user.id;

            const result = await this.getHistoryUseCase.execute(clientId);

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, "Service history fetched")
            );
        } catch (error) {
            next(error);
        }
    };

    getServiceByClientId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clientId = (req as any).user.id;
            const { serviceId } = req.params;

            const result = await this.getByIdUseCase.execute(serviceId, clientId);

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, "Service details fetched")
            );
        } catch (error) {
            next(error);
        }
    };

    getOngoingServices = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clientId = (req as any).user.id;

            const result = await this.getOngoingUseCase.execute(clientId);

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, "Ongoing services fetched")
            );
        } catch (error) {
            next(error);
        }
    };
}