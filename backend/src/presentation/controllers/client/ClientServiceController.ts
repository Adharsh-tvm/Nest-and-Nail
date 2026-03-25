import { Request, Response } from "express";
import { IGetClientServiceHistoryUseCase } from "../../../application/interfaces/service/client/IGetClientServiceHistoryUseCase";
import { IGetClientServiceByIdUseCase } from "../../../application/interfaces/service/client/IGetClientServiceByIdUseCase";
import { IGetClientOngoingServicesUseCase } from "../../../application/interfaces/service/client/IGetClientOngoingServicesUseCase";
import { IBookWorkerUseCase } from "../../../domain/repositories/IBookWorkerUseCase";

export class ClientServiceController {
    constructor(
        private readonly getHistoryUseCase: IGetClientServiceHistoryUseCase,
        private readonly getByIdUseCase: IGetClientServiceByIdUseCase,
        private readonly getOngoingUseCase: IGetClientOngoingServicesUseCase,
        private readonly bookWorkerUseCase: IBookWorkerUseCase
    ) { }

    bookWorker = async (req: Request, res: Response) => {

        const { workerId, category, date, selectedSlots, slotType, numberOfDays, title, description } = req.body;

        const clientId = (req as any).user?.id || (req as any).user?._id;

        if (!clientId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const scheduledDate = new Date(date);
        const parsedSelectedSlots = selectedSlots
            ? selectedSlots.map((s: any) => ({
                date: new Date(s.date),
                slotType: s.slotType
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
                coordinates: [0, 0]
            }
        });

        res.json({
            success: true,
            payload: result
        });
    };

    async getServiceHistory(req: Request, res: Response) {
        const clientId = req.user.id;

        const result = await this.getHistoryUseCase.execute(clientId);

        res.json({ success: true, data: result });
    }

    async getServiceByClientId(req: Request, res: Response) {
        const clientId = req.user.id;
        const { serviceId } = req.params;

        const result = await this.getByIdUseCase.execute(serviceId, clientId);

        res.json({ success: true, data: result });
    }

    async getOngoingServices(req: Request, res: Response) {
        const clientId = req.user.id;

        const result = await this.getOngoingUseCase.execute(clientId);

        res.json({ success: true, data: result });
    }
}