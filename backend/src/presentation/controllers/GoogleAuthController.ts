import { Request, Response } from "express";
import { IGoogleSignUpUseCase } from "../../application/interfaces/IGoogleSignUpUseCase";
import { Role } from "../../shared/enums/enums";
import { HttpStatusCode } from "../enums/httpCodes";
import { IGoogleAuthController } from "../interfaces/IGoogleAuthController";

export class GoogleAuthController implements IGoogleAuthController {
  constructor(private readonly _googleSignUpUseCase: IGoogleSignUpUseCase) { }

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, role } = req.body;
      const response = await this._googleSignUpUseCase.execute(email, name, role)
      res.status(HttpStatusCode.OK).json({ success: true, message: "Google user authenticated", payload: response })
    } catch (err: any) {
      console.error("[GoogleAuthController] Error:", err);
      res.status(HttpStatusCode.INTERNAL_SERVER).json({
        error: err.message || "Google authentication failed"
      });
    }
  }
}