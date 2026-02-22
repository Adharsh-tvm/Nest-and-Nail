import { Request, Response } from "express";
import { ICreateServiceRequestUseCase } from "../../application/interfaces/service-requests/client/ICreateServiceRequestUseCase ";
import { IServiceRequestController } from "../interfaces/IServiceRequestController";
import { ServiceRequestMapper } from "../../application/mappers/ServiceRequestMapper";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { ResponseHandler } from "../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../shared/responses/ResponseMessages";
import { IGetMyServiceRequestsUseCase } from "../../application/interfaces/service-requests/client/IGetMyServiceRequestsUseCase";
import { IGetServiceRequestByIdUseCase } from "../../application/interfaces/service-requests/IGetServiceRequestByIdUseCase";
import { IGetAllServiceRequestsUseCase } from "../../application/interfaces/service-requests/admin/IGetAllServiceRequestsUseCase";

import { IDeleteServiceRequestUseCase } from "../../application/interfaces/service-requests/client/IDeleteServiceRequestUseCase";
import { IDispatchServiceRequestUseCase } from "../../application/interfaces/service-requests/IDispatchServiceRequestUseCase";

export class ServiceRequestController implements IServiceRequestController {
    constructor(
        private readonly _createServiceRequestUseCase: ICreateServiceRequestUseCase,
        private readonly _getMyServiceRequestsUseCase: IGetMyServiceRequestsUseCase,
        private readonly _getServiceRequestByIdUseCase: IGetServiceRequestByIdUseCase,
        private readonly _getAllServiceRequestsUseCase: IGetAllServiceRequestsUseCase,
        private readonly _deleteServiceRequestUseCase: IDeleteServiceRequestUseCase,
        private readonly _dispatchServiceRequestUseCase: IDispatchServiceRequestUseCase
    ) { }

    delete = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { requestId } = req.params;
            const clientId = req.user.id;

            await this._deleteServiceRequestUseCase.execute(requestId, clientId);

            return res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(null, "Service request deleted successfully")
            );
        } catch (error: any) {
            return res.status(HttpStatusCode.BAD_REQUEST).json(
                ResponseHandler.error("Failed to delete request", error.message)
            );
        }
    };


    create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const clientId = req.user.id;

            const entity = await this._createServiceRequestUseCase.execute(
                ServiceRequestMapper.fromCreateDTO(req.body, clientId)
            );

            return res.status(HttpStatusCode.CREATED).json(
                ResponseHandler.success(
                    ServiceRequestMapper.toResponseDTO(entity),
                    RESPONSE_MESSAGES.CREATED
                )
            )
        } catch (error: any) {
            return res.status(HttpStatusCode.BAD_REQUEST).json(
                ResponseHandler.error(error.message, RESPONSE_MESSAGES.BAD_REQUEST)
            )
        }
    };

    getMyRequests = async (req: Request, res: Response) => {
        try {
            const clientId = req.user.id;

            const requests = await this._getMyServiceRequestsUseCase.execute(clientId);

            return res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(
                    requests.map(ServiceRequestMapper.toResponseDTO),
                    "My service requests"
                )
            );
        } catch (error: any) {
            return res.status(HttpStatusCode.BAD_REQUEST).json(
                ResponseHandler.error("Failed to fetch requests", error.message)
            );
        }
    };

    getById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { requestId } = req.params;
            const userId = req.user.id;

            const request = await this._getServiceRequestByIdUseCase.execute(
                requestId,
                userId
            );

            return res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(
                    ServiceRequestMapper.toResponseDTO(request),
                    "Service request details"
                )
            );
        } catch (error: any) {
            return res.status(HttpStatusCode.NOT_FOUND).json(
                ResponseHandler.error("Service request not found", error.message)
            );
        }
    };

    getAllForAdmin = async (_req: Request, res: Response): Promise<Response> => {
        try {
            const requests = await this._getAllServiceRequestsUseCase.execute();

            return res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(
                    requests.map(ServiceRequestMapper.toResponseDTO),
                    "All service requests"
                )
            );
        } catch (error: any) {
            return res.status(HttpStatusCode.INTERNAL_SERVER).json(
                ResponseHandler.error("Failed to fetch service requests", error.message)
            );
        }
    };

    async dispatch(req: Request, res: Response) {

        const { requestId } = req.params;

        const result = await this._dispatchServiceRequestUseCase.execute(requestId);

        return res.status(HttpStatusCode.OK).json(
            ResponseHandler.success(
                result, "Dispatch process executed"
            )
        );
    }
} 