import { Request, Response } from "express";
import { ICreateServiceRequestUseCase } from "../../application/interfaces/service-requests/client/ICreateServiceRequestUseCase ";
import { IGetOpenServiceRequestsUseCase } from "../../application/interfaces/service-requests/worker/IGetOpenServiceRequestsUseCase";
import { IReleaseServiceRequestUseCase } from "../../application/interfaces/service-requests/client/IReleaseServiceRequestUseCase";
import { IReserveServiceRequestUseCase } from "../../application/interfaces/service-requests/worker/IReserveServiceRequestUseCase ";
import { IServiceRequestController } from "../interfaces/IServiceRequestController";
import { ServiceRequestMapper } from "../../application/mappers/ServiceRequestMapper";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { ResponseHandler } from "../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../shared/responses/ResponseMessages";
import { IGetMyServiceRequestsUseCase } from "../../application/interfaces/service-requests/client/IGetMyServiceRequestsUseCase";

export class ServiceRequestController implements IServiceRequestController {
    constructor(
        private readonly _createServiceRequestUseCase: ICreateServiceRequestUseCase,
        private readonly _getOpenServiceRequestsUseCase: IGetOpenServiceRequestsUseCase,
        private readonly _reserveServiceRequestUseCase: IReserveServiceRequestUseCase,
        private readonly _releaseServiceRequestUseCase: IReleaseServiceRequestUseCase,
        private readonly _getMyServiceRequestsUseCase: IGetMyServiceRequestsUseCase
    ) { }

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
                ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, error.message)
            )
        }
    };

    getOpenRequests = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { lat, lng, radius } = req.query;

            const requests = await this._getOpenServiceRequestsUseCase.execute(
                [Number(lng), Number(lat)],
                radius ? Number(radius) : undefined
            );

            return res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(
                    requests.map(ServiceRequestMapper.toResponseDTO),
                    RESPONSE_MESSAGES.SUCCESS
                )
            );
        } catch (error: any) {
            return res.status(HttpStatusCode.BAD_REQUEST).json(
                ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, error.message)
            );
        }
    };

    reserve = async (req: Request, res: Response): Promise<Response> => {
        try {
            const workerId = req.user.id;
            const { requestId } = req.params;

            const result = await this._reserveServiceRequestUseCase.execute(
                requestId,
                workerId
            );

            return res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(
                    result,
                    RESPONSE_MESSAGES.SUCCESS
                )
            );
        } catch (error: any) {
            return res.status(HttpStatusCode.CONFLICT).json(
                ResponseHandler.error("Request not available", error.message)
            );
        }
    };

    release = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { requestId } = req.params;

            await this._releaseServiceRequestUseCase.execute(requestId);

            return res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(null, RESPONSE_MESSAGES.SUCCESS)
            );
        } catch (error: any) {
            return res.status(HttpStatusCode.BAD_REQUEST).json(
                ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, error.message)
            );
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
} 