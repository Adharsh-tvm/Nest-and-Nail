import { Request, Response } from "express";

export interface IServiceRequestController {
    create(req: Request, res: Response): Promise<Response>;
    getOpenRequests(req: Request, res: Response): Promise<Response>;
    reserve(req: Request, res: Response): Promise<Response>;
    release(req: Request, res: Response): Promise<Response>;
    getMyRequests(req: Request, res: Response): Promise<Response>;
}