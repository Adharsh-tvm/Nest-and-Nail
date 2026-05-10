import { Request, Response } from "express";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { IGetAllMeetingsForAdminUseCase } from "../../../application/interfaces/meetings/admin/IGetAllMeetingsForAdminUseCase";
import { IGetMeetingByIdForAdminUseCase } from "../../../application/interfaces/meetings/admin/IGetMeetingByIdForAdminUseCase";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";

export class AdminMeetingController {
    constructor(
        private readonly _getAllMeetingsUseCase: IGetAllMeetingsForAdminUseCase,
        private readonly _getMeetingByIdUseCase: IGetMeetingByIdForAdminUseCase
    ) { }

    async getAllMeetings(req: Request, res: Response) {
        try {
            const query = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                search: req.query.search as string,
                status: req.query.status as ServiceStatus,
            };

            const result = await this._getAllMeetingsUseCase.execute(query);

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, "Meetings fetched successfully")
            );

        } catch {
            res.status(HttpStatusCode.INTERNAL_SERVER).json(
                ResponseHandler.error("Failed to fetch meetings")
            );
        }
    }

    async getMeetingById(req: Request, res: Response) {
        try {
            const { serviceId } = req.params;

            const result = await this._getMeetingByIdUseCase.execute(serviceId);

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(result, "Meeting fetched successfully")
            );

        } catch {
            res.status(HttpStatusCode.INTERNAL_SERVER).json(
                ResponseHandler.error("Failed to fetch meeting")
            );
        }
    }
}