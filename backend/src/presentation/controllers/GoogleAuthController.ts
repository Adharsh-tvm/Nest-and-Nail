import { Request, Response } from "express";
import { IGoogleLoginUseCase } from "../../application/interfaces/IGoogleLoginUseCase";
import { Role } from "../../shared/enums/enums";
import { HttpStatusCode } from "../enums/httpCodes";
import { IGoogleAuthController } from "../interfaces/IGoogleAuthController";

export class GoogleAuthController implements IGoogleAuthController{
  constructor(private readonly googleLoginUseCase: IGoogleLoginUseCase) {}

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken, role } = req.body;

      if (!accessToken) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          error: "Missing Google auth code"
        });
        return;
      }

      // Validate role or fallback
      const finalRole =
        role === Role.CLIENT || role === Role.WORKER
          ? role
          : Role.CLIENT;

      const result = await this.googleLoginUseCase.execute(accessToken, finalRole);

      res.status(HttpStatusCode.OK).json({
        message: "Google login success",
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

    } catch (err: any) {
      console.error("[GoogleAuthController] Error:", err);
      res.status(HttpStatusCode.INTERNAL_SERVER).json({
        error: err.message || "Google login failed"
      });
    }
  }
}
