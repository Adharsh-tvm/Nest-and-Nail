import { Request, Response } from "express";
import { IGoogleSignUpUseCase } from "../../application/interfaces/IGoogleSignUpUseCase";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { IGoogleAuthController } from "../interfaces/IGoogleAuthController";
import { ResponseHandler } from "../responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../responses/ResponseMessages";

export class GoogleAuthController implements IGoogleAuthController {
  constructor(
    private readonly _googleSignUpUseCase: IGoogleSignUpUseCase
  ) {}

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, role } = req.body;

      const result = await this._googleSignUpUseCase.execute(
        email,
        name,
        role
      );

      ResponseHandler.success(
        res,
        result,
        RESPONSE_MESSAGES.GOOGLE_AUTH_SUCCESS,
        HttpStatusCode.OK
      );
    } catch (error) {
      console.error("[GoogleAuthController] Error:", error);

      ResponseHandler.error(
        res,
        RESPONSE_MESSAGES.GOOGLE_AUTH_FAILED,
        HttpStatusCode.INTERNAL_SERVER,
        error
      );
    }
  }
}
