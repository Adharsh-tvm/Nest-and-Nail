import { NextFunction, Request, Response } from "express";
import { IGetClientServiceHistoryUseCase } from "../../../application/interfaces/service/client/IGetClientServiceHistoryUseCase";
import { IGetClientServiceByIdUseCase } from "../../../application/interfaces/service/client/IGetClientServiceByIdUseCase";
import { IGetClientOngoingServicesUseCase } from "../../../application/interfaces/service/client/IGetClientOngoingServicesUseCase";
import { IBookWorkerUseCase } from "../../../domain/repositories/IBookWorkerUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { ICancelServiceUseCase } from "../../../application/interfaces/service/ICancelServiceUseCase";
import { SlotType } from "../../../shared/enums/slotEnums";
import { IWorkerScheduleRepository } from "../../../domain/repositories/IWorkerScheduleRepository";

export class ClientServiceController {
    constructor(
        private readonly _getHistoryUseCase: IGetClientServiceHistoryUseCase,
        private readonly _getByIdUseCase: IGetClientServiceByIdUseCase,
        private readonly _getOngoingUseCase: IGetClientOngoingServicesUseCase,
        private readonly _bookWorkerUseCase: IBookWorkerUseCase,
        private readonly _cancelServiceUseCase: ICancelServiceUseCase,
        private readonly _scheduleRepo: IWorkerScheduleRepository
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
                numberOfWorkers,
                title,
                description,
                address,
                pricePerWorker,
            } = req.body as {
                workerId: string;
                category: string;
                date: string;
                selectedSlots?: { date: string | Date; slotType: string }[];
                slotType?: string;
                numberOfDays: number;
                numberOfWorkers: number;
                title: string;
                description: string;
                address?: {
                    street?: string;
                    city?: string;
                    state?: string;
                    country?: string;
                    zip?: string;
                    label?: string;
                    lng?: number;
                    lat?: number;
                };
                pricePerWorker: number;
            };

            const clientId = req.user?.id;

            if (!clientId) {
                return res
                    .status(HttpStatusCode.UNAUTHORIZED)
                    .json(ResponseHandler.error("Unauthorized"));
            }

            const scheduledDate = new Date(date);

            const parsedSelectedSlots = selectedSlots
                ? selectedSlots.map((s: { date: string | Date; slotType: string }) => ({
                    date: new Date(s.date),
                    slotType: s.slotType as SlotType,
                }))
                : [{ date: scheduledDate, slotType: (slotType as SlotType | undefined) ?? SlotType.FULL_DAY }];

            const bookingAddress = address ? {
                street: address.street,
                city: address.city,
                state: address.state,
                country: address.country,
                zip: address.zip,
                label: address.label
            } : undefined;

            const bookingLocation = address?.lng && address.lat ? {
                type: "Point" as const,
                coordinates: [address.lng, address.lat] as [number, number]
            } : {
                type: "Point" as const,
                coordinates: [0, 0] as [number, number]
            };


            const result = await this._bookWorkerUseCase.execute({
                clientId,
                workerId,
                category,
                scheduledDate,
                selectedSlots: parsedSelectedSlots,
                numberOfDays,
                numberOfWorkers,
                title,
                description,
                location: bookingLocation,
                address: bookingAddress,
                pricePerWorker
            });

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, "Worker booked successfully")
            );
        } catch (error) {
            next(error);
        }
    };

    getServiceHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clientId = req.user?.id;

            if (!clientId) {
                return res
                    .status(HttpStatusCode.UNAUTHORIZED)
                    .json(ResponseHandler.error("Unauthorized"));
            }

            const result = await this._getHistoryUseCase.execute(clientId);

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, "Service history fetched")
            );
        } catch (error) {
            next(error);
        }
    };

    getServiceByClientId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clientId = req.user?.id;

            if (!clientId) {
                return res
                    .status(HttpStatusCode.UNAUTHORIZED)
                    .json(ResponseHandler.error("Unauthorized"));
            }
            const { serviceId } = req.params;

            const result = await this._getByIdUseCase.execute(serviceId, clientId);

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, "Service details fetched")
            );
        } catch (error) {
            next(error);
        }
    };

    getOngoingServices = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clientId = req.user?.id;

            if (!clientId) {
                return res
                    .status(HttpStatusCode.UNAUTHORIZED)
                    .json(ResponseHandler.error("Unauthorized"));
            }

            const result = await this._getOngoingUseCase.execute(clientId);

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, "Ongoing services fetched")
            );
        } catch (error) {
            next(error);
        }
    };

    async cancelService(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(HttpStatusCode.UNAUTHORIZED).json(
                    ResponseHandler.error("Unauthorized")
                );
                return;
            }
            const { serviceId } = req.params;
            const { reason } = req.body as { reason?: string };

            await this._cancelServiceUseCase.execute(serviceId, userId, reason);

            res.status(HttpStatusCode.OK).json(ResponseHandler.success(null, "Service cancelled successfully"));
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to cancel service";
            res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHandler.error(message, error));
        }
    }

    lockSlots = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { workerId, selectedSlots, serviceId } = req.body as Partial<{
                workerId: string;
                selectedSlots: { date: string | Date; slotType: string }[];
                serviceId: string;
            }>;

            if (!workerId || !selectedSlots || !serviceId) {
                return res
                    .status(HttpStatusCode.BAD_REQUEST)
                    .json(ResponseHandler.error("workerId, selectedSlots, and serviceId are required"));
            }

            const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);
            const lockedSlots: typeof selectedSlots = [];
            try {
                for (const slot of selectedSlots) {
                    await this._scheduleRepo.lockSlot(
                        workerId,
                        new Date(slot.date),
                        slot.slotType,
                        tenMinutesFromNow,
                        serviceId
                    );
                    lockedSlots.push(slot);
                }
            } catch (error) {
                // Rollback locked slots on failure to prevent stale locks
                for (const slot of lockedSlots) {
                    try {
                        await this._scheduleRepo.unlockSlot(workerId, new Date(slot.date), slot.slotType, serviceId);
                    } catch (unlockError) {
                        console.error("Failed to unlock slot during rollback", unlockError);
                    }
                }
                throw error;
            }

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(null, "Slots locked successfully")
            );
        } catch (error) {
            next(error);
        }
    };

    unlockSlots = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { workerId, selectedSlots, serviceId } = req.body as Partial<{
                workerId: string;
                selectedSlots: { date: string | Date; slotType: string }[];
                serviceId: string;
            }>;

            if (!workerId || !selectedSlots || !serviceId) {
                return res
                    .status(HttpStatusCode.BAD_REQUEST)
                    .json(ResponseHandler.error("workerId, selectedSlots, and serviceId are required"));
            }

            for (const slot of selectedSlots) {
                await this._scheduleRepo.unlockSlot(
                    workerId,
                    new Date(slot.date),
                    slot.slotType,
                    serviceId
                );
            }

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(null, "Slots unlocked successfully")
            );
        } catch (error) {
            next(error);
        }
    };
}