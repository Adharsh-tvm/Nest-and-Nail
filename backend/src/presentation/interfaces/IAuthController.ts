import { Request, Response } from "express";

export interface IAuthController {
    register(req: Request, res: Response): Promise<void | Response>;
    login(req: Request, res: Response): Promise<void | Response>;
    logout(req: Request, res: Response): Promise<void | Response>;
    getCurrentUser(req: Request, res: Response): Promise<void | Response>;
}