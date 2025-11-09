import { Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpCodes";
import { IRegisterClientUseCase } from "../../application/interfaces/IRegisterClientUseCase";
import { ILoginClientUseCase } from "../../application/interfaces/ILoginClientUseCase";
import { loggerInstance } from "../../infrastructure/logger/Logger";
import { IAuthController } from "../interfaces/IAuthController";
import { setAuthCookies } from "../utils/setAuthCookies";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { IGetCurrentUserUseCase } from "../../application/interfaces/IGetCurrentUserUseCase";

export class AuthController implements IAuthController {
  constructor(
    private readonly _registerClient: IRegisterClientUseCase,
    private readonly _loginClient: ILoginClientUseCase,
    private readonly _getCurrentuser: IGetCurrentUserUseCase
  ) { }

  //  REGISTER
  async register(req: Request, res: Response) {
    try {
      // Register the user
      const registrationResult = await this._registerClient.execute(req.body);

      // The registration already returns tokens, so we can use those
      // OR we can login again to generate fresh tokens
      // Current implementation logs in again for fresh tokens
      const loginResult = await this._loginClient.execute(req.body);
      const { accessToken, refreshToken, user } = loginResult;

      // Set cookies with the tokens from login
      setAuthCookies(res, accessToken, refreshToken);

      // Return the user object from login result (not registrationResult)
      res.status(HttpStatusCode.CREATED).json({
        user: user  // This matches what frontend expects
      });
    } catch (error: any) {
      loggerInstance.error(`Registration error: ${error.message}`);
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
    }
  }

  //  LOGIN — sets HttpOnly cookies
  async login(req: Request, res: Response) {
    try {
      loggerInstance.info(`Login attempt from ${req.body.email_address}`);
      const result = await this._loginClient.execute(req.body);
      const { accessToken, refreshToken, user } = result;

      setAuthCookies(res, accessToken, refreshToken);

      res
        .status(HttpStatusCode.OK)
        .json({ user });
    } catch (error: any) {
      loggerInstance.error(`Login error: ${error.message}`);
      res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ message: error.message });
    }
  }


  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      const userResponse = await this._getCurrentuser.execute(userId);
      return res.status(HttpStatusCode.OK).json({ user: userResponse });
    } catch (error: any) {
      loggerInstance.error(`Get current user error: ${error.message}`)
      const status = error.status || HttpStatusCode.INTERNAL_SERVER;

      return res.status(status).json({
        code: error.code,
        message: error.message
      })
    }
  }


  //  LOGOUT — clears cookies
  async logout(req: Request, res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(HttpStatusCode.OK).json({ message: "Logged out successfully" });
  }
}