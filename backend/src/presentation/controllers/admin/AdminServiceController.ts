import { Request, Response } from "express";
import { IGetAllServicesUseCase } from "../../../application/interfaces/service/admin/IGetAllServicesUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";
import { IGetServiceDetailsForAdminUseCase } from "../../../application/interfaces/service/admin/IGetServiceDetailsForAdminUseCase";

export class AdminServiceController {

    constructor(
        private readonly _getAllServicesUseCase: IGetAllServicesUseCase,
        private readonly _getServiceDetailsForAdminUseCase: IGetServiceDetailsForAdminUseCase
    ) { }

    async getAllServices(req: Request, res: Response): Promise<void> {
        try {
            const services = await this._getAllServicesUseCase.execute();

            console.log("services: ", services)

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(services, "All Services Fetched Successfully")
            )

        } catch (error: unknown) {
            res.status(HttpStatusCode.INTERNAL_SERVER).json(
                ResponseHandler.error(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR)
            )
        }
    }

    async getServiceDetails(req: Request, res: Response): Promise<void> {
        try {
            const { serviceId } = req.params;

            if (!serviceId) {
                res.status(HttpStatusCode.BAD_REQUEST).json(
                    ResponseHandler.error("Service ID is required")
                )
                return;
            }

            const service = await this._getServiceDetailsForAdminUseCase.execute(serviceId);

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(service, "Service details fetched successfully")
            )

        } catch (error: unknown) {
            res.status(HttpStatusCode.INTERNAL_SERVER).json(
                ResponseHandler.error("Failed to fetch service details")
            );
        }
    }
}