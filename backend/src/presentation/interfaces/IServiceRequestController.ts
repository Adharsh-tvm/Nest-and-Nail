import { Request, Response } from "express";

export interface IServiceRequestController {
    create(req: Request, res: Response): Promise<Response>;
    getMyRequests(req: Request, res: Response): Promise<Response>;
    getById(req: Request, res: Response): Promise<Response>;
    getAllForAdmin(req: Request, res: Response): Promise<Response>;
    delete(req: Request, res: Response): Promise<Response>;
    dispatch(req: Request, res: Response): Promise<Response>;
}