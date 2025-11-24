import { Request, Response } from "express";

export interface IAdminController {
    handle(req: Request, res: Response): Promise<void>;
}
