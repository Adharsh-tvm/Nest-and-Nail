import { Request, Response } from "express";

export interface IServiceController {
    acceptRequest(req: Request, res: Response): Promise<Response>;
    startService(req: Request, res: Response): Promise<Response>;
    completeService(req: Request, res: Response): Promise<Response>;
    cancelService(req: Request, res: Response): Promise<Response>;
}