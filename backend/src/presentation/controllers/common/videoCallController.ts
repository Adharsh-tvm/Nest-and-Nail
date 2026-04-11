import { Request, Response } from "express";
import { IJoinVideoCallUseCase } from "../../../application/interfaces/meetings/IJoinVideoCallUseCase";
import { IEndVideoCallUseCase } from "../../../application/interfaces/meetings/IEndVideoCallUseCase";

export class VideoCallController {
    constructor(
        private joinUseCase: IJoinVideoCallUseCase,
        private endUseCase: IEndVideoCallUseCase
    ) { }

    joinCall = async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const { serviceId } = req.params;

            const result = await this.joinUseCase.execute(serviceId, userId);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    };

    endCall = async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const { serviceId } = req.params;

            const result = await this.endUseCase.execute(serviceId, userId);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    };
}