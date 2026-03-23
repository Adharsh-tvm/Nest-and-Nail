import { Request, Response } from "express";
import { IGoogleSignUpUseCase } from "../../application/interfaces/auth/IGoogleSignUpUseCase";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { IGoogleAuthController } from "../interfaces/IGoogleAuthController";
import { ResponseHandler } from "../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../shared/responses/ResponseMessages";
import { LoginResponseDTO } from "../../application/dtos/UserDTO";

export class GoogleAuthController implements IGoogleAuthController {
  constructor(
    private readonly _googleSignUpUseCase: IGoogleSignUpUseCase
  ) { }

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, role } = req.body;

      const result = await this._googleSignUpUseCase.execute(
        email,
        name,
        role
      );

      res.status(HttpStatusCode.OK).json(ResponseHandler.success<LoginResponseDTO>(result, RESPONSE_MESSAGES.GOOGLE_AUTH_SUCCESS))

    } catch (error) {
      console.error("[GoogleAuthController] Error:", error);

      res.status(HttpStatusCode.INTERNAL_SERVER).json(ResponseHandler.error(RESPONSE_MESSAGES.GOOGLE_AUTH_FAILED, error))

    }
  }
}
