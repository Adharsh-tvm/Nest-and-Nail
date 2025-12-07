import { Request, Response } from "express";

export interface IUploadController {
    uploadProfile(req: Request, res: Response): Promise<Response>;
    uploadDocument(req: Request, res: Response): Promise<Response>;
}
