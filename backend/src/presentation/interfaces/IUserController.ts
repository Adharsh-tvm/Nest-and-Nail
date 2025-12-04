import { Request, Response } from "express";

export interface IUserController {
    changeRole(req: Request, res: Response): Promise<Response>;
}
