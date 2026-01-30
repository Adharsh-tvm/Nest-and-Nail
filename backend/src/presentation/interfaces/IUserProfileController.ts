import { Request, Response } from "express";

export interface IUserProfileController {
    updateProfile: (req: Request, res: Response) => Promise<Response>;
    updateSkills: (req: Request, res: Response) => Promise<Response>;
    updateAddress: (req: Request, res: Response) => Promise<Response>;
    updateCategories(req: Request, res: Response): Promise<void>;
}
