import { Request, Response } from "express";

export interface ICategoryController {
  create(req: Request, res: Response): Promise<void>;
  getAll(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  updateStatus(req: Request, res: Response): Promise<void>;
}
