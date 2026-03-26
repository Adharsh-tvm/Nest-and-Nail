import { Request, Response } from "express";
import { IGetWorkerServicesUseCase } from "../../../application/interfaces/service/worker/IGetWorkerServicesUseCase";
import { IGetWorkerServiceDetailsUseCase } from "../../../application/interfaces/service/worker/IGetWorkerServiceDetailsUseCase";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { IGetActiveWorkerServiceUseCase } from "../../../application/interfaces/service/worker/IGetActiveWorkerServiceUseCase";

export class WorkerServiceController {

    constructor(
        private readonly _getWorkerServicesUseCase: IGetWorkerServicesUseCase,
        private readonly _getWorkerServiceDetailsUseCase: IGetWorkerServiceDetailsUseCase,
        private readonly _getActiveWorkerServiceUseCase: IGetActiveWorkerServiceUseCase
    ) { }

    async getWorkerServices(req: Request, res: Response): Promise<void> {
        try {
            const workerId = (req as any).user?.id;

            if (!workerId) {
                res.status(HttpStatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized"
                });
                return;
            }

            const { status } = req.query;

            let parsedStatus: ServiceStatus | undefined;

            if (typeof status === "string") {
                if (Object.values(ServiceStatus).includes(status as ServiceStatus)) {
                    parsedStatus = status as ServiceStatus;
                } else {
                    res.status(HttpStatusCode.BAD_REQUEST).json({
                        success: false,
                        message: "Invalid service status"
                    });
                    return;
                }
            }

            const services = await this._getWorkerServicesUseCase.execute(
                workerId,
                parsedStatus
            );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Worker services fetched successfully",
                data: services
            });

        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER).json({
                success: false,
                message: error.message || "Failed to fetch worker services"
            });
        }
    }

    async getWorkerServiceDetails(req: Request, res: Response): Promise<void> {
        try {
            const workerId = (req as any).user?.id;
            const { serviceId } = req.params;

            if (!workerId) {
                res.status(HttpStatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized"
                });
                return;
            }

            if (!serviceId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Service ID is required"
                });
                return;
            }

            const service = await this._getWorkerServiceDetailsUseCase.execute(
                serviceId,
                workerId
            );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Service details fetched successfully",
                data: service
            });

        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER).json({
                success: false,
                message: error.message || "Failed to fetch service details"
            });
        }
    }

    async getActiveService(req: Request, res: Response): Promise<void> {
        try {
            const workerId = (req as any).user?.id;

            if (!workerId) {
                res.status(HttpStatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized"
                });
                return;
            }

            const service = await this._getActiveWorkerServiceUseCase.execute(workerId);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Active service fetched successfully",
                data: service
            });

        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER).json({
                success: false,
                message: error.message || "Failed to fetch active service"
            });
        }
    }
}