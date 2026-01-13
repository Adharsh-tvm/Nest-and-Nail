import { Request, Response } from "express";

export interface IAdminController {
    getAllClients(req: Request, res: Response): Promise<void>;
    getAllWorkers(req: Request, res: Response): Promise<void>;
    approveVerification(req: Request, res: Response): Promise<void>;
    rejectVerification(req: Request, res: Response): Promise<void>;
    updateUserAccess(req: Request, res: Response): Promise<void>;
}
