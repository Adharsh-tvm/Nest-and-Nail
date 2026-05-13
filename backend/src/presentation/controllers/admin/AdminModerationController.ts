import { Request, Response } from "express";
import { IProcessModerationActionsUseCase } from "../../../application/interfaces/moderation/IProcessModerationActionsUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";

export class AdminModerationController {
    constructor(
        private readonly _processModerationActionsUseCase: IProcessModerationActionsUseCase
    ) { }

    async processModeration(req: Request, res: Response): Promise<void> {
        try {
            const result = await this._processModerationActionsUseCase.execute();
            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, result.message)
            );
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Failed to run moderation checks";
            res.status(HttpStatusCode.INTERNAL_SERVER).json(
                ResponseHandler.error(msg)
            );
        }
    }
}
