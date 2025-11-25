import { Request, Response } from "express";

export interface IAuthController {
  register(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  sendOtp(req: Request, res: Response): Promise<Response>;
  verifyOtp(req: Request, res: Response): Promise<Response>;
  logout(req: Request, res: Response): Promise<void>;
}
