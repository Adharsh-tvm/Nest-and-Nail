import { Request, Response } from "express";

export interface IUserController {
    changeRole(req: Request, res: Response): Promise<Response>;
    getCurrentUser(req: Request, res: Response): Promise<Response>;
    getOnlineWorkers(req: Request, res: Response): Promise<Response>;
}
