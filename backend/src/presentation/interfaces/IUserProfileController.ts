import { Request, Response } from "express";

export interface IUserProfileController {
    updateProfile: (req: Request, res: Response) => Promise<Response>;
    updateSkills: (req: Request, res: Response) => Promise<Response>;
    updateCategories(req: Request, res: Response): Promise<void>;
    addAddress(req: Request, res: Response): Promise<Response>;
    editAddress(req: Request, res: Response): Promise<Response>;
    deleteAddress(req: Request, res: Response): Promise<Response>;
}
