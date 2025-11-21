import { Request, Response } from "express";
import { IGoogleSignUpUseCase } from "../../application/interfaces/IGoogleSignUpUseCase";
import { Role } from "../../shared/enums/enums";
import { HttpStatusCode } from "../enums/httpCodes";
import { IGoogleAuthController } from "../interfaces/IGoogleAuthController";

export class GoogleAuthController implements IGoogleAuthController {
  constructor(private readonly googleLoginUseCase: IGoogleSignUpUseCase) { }

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken, role, mode } = req.body;

      console.log("[GoogleAuthController] Received request:", {
        hasAccessToken: !!accessToken,
        role,
        mode
      });

      if (!accessToken) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          error: "Missing Google access token"
        });
        return;
      }

      // Determine final role based on mode
      let finalRole: Role | undefined;
      
      if (mode === "login") {
        // For login, let use case determine role from existing user
        finalRole = undefined;
      } else {
        // For signup, use provided role or default to CLIENT
        // Convert string to enum if needed
        if (role === "WORKER" || role === Role.WORKER) {
          finalRole = Role.WORKER;
        } else if (role === "CLIENT" || role === Role.CLIENT) {
          finalRole = Role.CLIENT;
        } else {
          finalRole = Role.CLIENT; // default
        }
      }

      console.log("[GoogleAuthController] Final role determined:", finalRole);

      const result = await this.googleLoginUseCase.execute(
        accessToken, 
        finalRole,
        mode
      );

      console.log("[GoogleAuthController] User created/logged in with role:", result.user.role);

      res.status(HttpStatusCode.OK).json({
        message: "Google authentication successful",
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

    } catch (err: any) {
      console.error("[GoogleAuthController] Error:", err);
      res.status(HttpStatusCode.INTERNAL_SERVER).json({
        error: err.message || "Google authentication failed"
      });
    }
  }
}