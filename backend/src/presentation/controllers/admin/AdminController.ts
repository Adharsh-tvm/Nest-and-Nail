import { Request, Response } from "express";
import { IAdminController } from "../../interfaces/IAdminController";
import { IGetAllClientsUseCase } from "../../../application/interfaces/admin/IGetAllClientsUseCase";
import { IGetAllWorkersUseCase } from "../../../application/interfaces/admin/IGetAllWorkersUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { IUpdateVerificationStatusUseCase } from "../../../application/interfaces/admin/IUpdateVerificationStatusUseCase";
import { VerificationStatus } from "../../../shared/enums/authEnums";
import { IUpdateUserAccessUseCase } from "../../../application/interfaces/admin/IUpdateUserAccessUseCase";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";
import { IGetAllUsersUseCase } from "../../../application/interfaces/admin/IGetAllUsersUseCase";

import { IGetAdminDashboardDataUseCase } from "../../../application/interfaces/admin/IGetAdminDashboardDataUseCase";

export class AdminController implements IAdminController {
    constructor(
        private readonly _getAllClientsUseCase: IGetAllClientsUseCase,
        private readonly _getAllWorkersUseCase: IGetAllWorkersUseCase,
        private readonly _updateVerificationStatusUseCase: IUpdateVerificationStatusUseCase,
        private readonly _updateUserAccessUseCase: IUpdateUserAccessUseCase,
        private readonly _getAllUsersUseCase: IGetAllUsersUseCase,
        private readonly _getAdminDashboardDataUseCase: IGetAdminDashboardDataUseCase

    ) { }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const query = {
                isBlocked:
                    req.query.isBlocked !== undefined
                        ? req.query.isBlocked === "true"
                        : undefined,

                isVerified: req.query.isVerified as VerificationStatus,
                search: req.query.search as string,

                sortBy: req.query.sortBy as "createdAt" | "name" | "email" | undefined,
                sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,

                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 20,
            };

            const result = await this._getAllUsersUseCase.execute(query);

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, RESPONSE_MESSAGES.USERS_FETCHED)
            );
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER).json(
                ResponseHandler.error(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR)
            );
        }
    }

    async getAllClients(req: Request, res: Response): Promise<void> {
        try {
            const clients = await this._getAllClientsUseCase.execute();

            res.status(HttpStatusCode.OK).json(ResponseHandler.success(clients, RESPONSE_MESSAGES.USERS_FETCHED));
        } catch (error: unknown) {
            console.error("[GetAllClientsController] Error:", error);

            const message =
                error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);

            res.status(HttpStatusCode.INTERNAL_SERVER).json(ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, message));
        }
    }

    async getAllWorkers(req: Request, res: Response): Promise<void> {

        try {
            const workers = await this._getAllWorkersUseCase.execute();

            res.status(HttpStatusCode.OK).json(ResponseHandler.success(workers, RESPONSE_MESSAGES.USERS_FETCHED));
        } catch (error: unknown) {

            const message =
                error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);

            res.status(HttpStatusCode.INTERNAL_SERVER).json(ResponseHandler.error(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, message));
        }
    }

    approveVerification = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;

            const result = await this._updateVerificationStatusUseCase.execute(
                userId,
                VerificationStatus.VERIFIED
            );

            res.status(HttpStatusCode.OK).json(ResponseHandler.success(result, RESPONSE_MESSAGES.SUCCESS));

        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : String(error);
            res.status(HttpStatusCode.INTERNAL_SERVER).json(ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, message));
        }
    };

    rejectVerification = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const { reason } = req.body as { reason?: string };

            if (!reason) {
                res.status(HttpStatusCode.BAD_REQUEST).json(
                    ResponseHandler.error("Rejection reason is required")
                );
                return;
            }

            const result = await this._updateVerificationStatusUseCase.execute(
                userId,
                VerificationStatus.REJECTED,
                reason
            );

            res.status(HttpStatusCode.OK).json(ResponseHandler.success(result, RESPONSE_MESSAGES.SUCCESS));

        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : String(error);
            res.status(HttpStatusCode.INTERNAL_SERVER).json(ResponseHandler.error(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, message));
        }
    };

    updateUserAccess = async (req: Request, res: Response): Promise<void> => {
        try {

            const { userId } = req.params;
            const result = await this._updateUserAccessUseCase.execute(userId);


            res.status(HttpStatusCode.OK).json(ResponseHandler.success(result, RESPONSE_MESSAGES.UPDATED));

        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : String(error);
            res.status(HttpStatusCode.INTERNAL_SERVER).json(ResponseHandler.error(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, message));
        }
    }

    getDashboardData = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this._getAdminDashboardDataUseCase.execute();
            res.status(HttpStatusCode.OK).json(ResponseHandler.success(data, "Dashboard data fetched successfully"));
        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : String(error);
            res.status(HttpStatusCode.INTERNAL_SERVER).json(ResponseHandler.error(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, message));
        }
    }
}