import { Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpCodes";
import { IRegisterClientUseCase } from "../../application/interfaces/IRegisterClientUseCase";
import { ILoginClientUseCase } from "../../application/interfaces/ILoginClientUseCase";
import { loggerInstance } from "../../infrastructure/logger/Logger";
import { IAuthController } from "../interfaces/IAuthController";
import { setAuthCookies } from "../utils/setAuthCookies";
import { IGetCurrentUserUseCase } from "../../application/interfaces/IGetCurrentUserUseCase";

export class AuthController implements IAuthController {
  constructor(
    private readonly _registerClient: IRegisterClientUseCase,
    private readonly _loginClient: ILoginClientUseCase,
    private readonly _getCurrentuser: IGetCurrentUserUseCase
  ) {}

  /**
   * Registers a new user.
   * Generates tokens and sets cookies.
   * Returns user data and tokens to client.
   */
  async register(req: Request, res: Response) {
    try {
      const registrationResult = await this._registerClient.execute(req.body);
      const loginResult = await this._loginClient.execute(req.body);
      const { accessToken, refreshToken, user } = loginResult;

      setAuthCookies(res, accessToken, refreshToken);

      res.status(HttpStatusCode.CREATED).json({
        user,
        accessToken,
        refreshToken
      });
    } catch (error: any) {
      loggerInstance.error(`Registration error: ${error.message}`);
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
    }
  }

  /**
   * Authenticates user and generates tokens.
   * Sets cookies and returns tokens for Next.js usage.
   */
  async login(req: Request, res: Response) {
    try {
      loggerInstance.info(`Login attempt from ${req.body.email_address}`);
      const result = await this._loginClient.execute(req.body);
      const { accessToken, refreshToken, user } = result;

      setAuthCookies(res, accessToken, refreshToken);

      res.status(HttpStatusCode.OK).json({
        user,
        accessToken,
        refreshToken
      });
    } catch (error: any) {
      loggerInstance.error(`Login error: ${error.message}`);
      res.status(HttpStatusCode.UNAUTHORIZED).json({ message: error.message });
    }
  }

  /**
   * Fetches currently authenticated user.
   * Relies on decoded user ID inserted by middleware.
   */
  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const userResponse = await this._getCurrentuser.execute(userId);

      return res.status(HttpStatusCode.OK).json({ user: userResponse });
    } catch (error: any) {
      loggerInstance.error(`Get current user error: ${error.message}`);
      const status = error.status || HttpStatusCode.INTERNAL_SERVER;
      return res.status(status).json({
        code: error.code,
        message: error.message
      });
    }
  }

  /**
   * Logs out user by clearing auth cookies.
   * Does not invalidate tokens server-side.
   */
  async logout(req: Request, res: Response) {
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    res.status(HttpStatusCode.OK).json({ message: "Logged out successfully" });
  }
}
