import { Request, Response } from "express";

export interface IAdminController {
    getAllClients(req: Request, res: Response): Promise<void>;
    getAllWorkers(req: Request, res: Response): Promise<void>;
}
