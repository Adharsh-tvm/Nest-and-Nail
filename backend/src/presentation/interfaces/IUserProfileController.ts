import { Request, Response } from "express";

export interface IUserProfileController {
    updateProfile: (req: Request, res: Response) => Promise<Response>;
}
