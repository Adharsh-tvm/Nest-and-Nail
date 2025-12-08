import { Request, Response } from "express";
import { IAdminController } from "../interfaces/IAdminController";
import { IGetAllClientsUseCase } from "../../application/interfaces/IGetAllClientsUseCase";
import { IGetAllWorkersUseCase } from "../../application/interfaces/IGetAllWorkersUseCase";
import { HttpStatusCode } from "../enums/httpCodes";
import { IUpdateVerificationStatusUseCase } from "../../application/interfaces/IUpdateVerificationStatusUseCase";
import { VerificationStatus } from "../../domain/enums/enums";

export class AdminController implements IAdminController {
    constructor(
        private readonly _getAllClientsUseCase: IGetAllClientsUseCase,
        private readonly _getAllWorkersUseCase: IGetAllWorkersUseCase,
        private readonly _updateVerificationStatusUseCase: IUpdateVerificationStatusUseCase,

    ) { }

    async getAllClients(req: Request, res: Response): Promise<void> {
        try {
            console.log('Admin controller called')
            const clients = await this._getAllClientsUseCase.execute();

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Clients fetched successfully",
                data: clients
            });
        } catch (error: unknown) {
            console.error("[GetAllClientsController] Error:", error);

            const message =
                error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);

            res.status(HttpStatusCode.INTERNAL_SERVER).json({
                success: false,
                message: "Failed to fetch clients",
                error: message || "Unknown error"
            });
        }
    }

    async getAllWorkers(req: Request, res: Response): Promise<void> {

        try {
            console.log('Admin controller called')
            const workers = await this._getAllWorkersUseCase.execute();

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Workers fetched successfully",
                data: workers
            });
        } catch (error: unknown) {
            console.error("[GetAllWorkersController] Error:", error);

            const message =
                error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);

            res.status(HttpStatusCode.INTERNAL_SERVER).json({
                success: false,
                message: "Failed to fetch workers",
                error: message || "Unknown error"
            });
        }
    }

    approveVerification = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;

            const result = await this._updateVerificationStatusUseCase.execute(
                userId,
                VerificationStatus.VERIFIED
            );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "User approved successfully",
                user: result
            });

        } catch (error: any) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER).json({
                success: false,
                message: error.message || "Internal server error"
            });
        }
    };


    rejectVerification = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;

            const result = await this._updateVerificationStatusUseCase.execute(
                userId,
                VerificationStatus.NOT_VERIFIED
            );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "User rejected successfully",
                user: result
            });

        } catch (error: any) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER).json({
                success: false,
                message: error.message || "Internal server error"
            });
        }
    };
}