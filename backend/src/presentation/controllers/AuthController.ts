import { Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpCodes";
import { IRegisterClientUseCase } from "../../application/interfaces/IRegisterClientUseCase";
import { ILoginClientUseCase } from "../../application/interfaces/ILoginClientUseCase";
import { loggerInstance } from "../../infrastructure/logger/Logger";
import { IAuthController } from "../interfaces/IAuthController";
import { setAuthCookies } from "../utils/setAuthCookies";

export class AuthController implements IAuthController {
  constructor(
    private readonly _registerClient: IRegisterClientUseCase,
    private readonly _loginClient: ILoginClientUseCase,
  ) { }

  //  REGISTER
  async register(req: Request, res: Response) {
    try {
      const createdUser = await this._registerClient.execute(req.body);

      const result = await this._loginClient.execute(req.body);
      const { accessToken, refreshToken, user } = result;

      setAuthCookies(res, accessToken, refreshToken);

      res.status(HttpStatusCode.CREATED).json(createdUser);
    } catch (error: any) {
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
      res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ message: error.message });
    }
  }


  //  LOGOUT — clears cookies
  async logout(req: Request, res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(HttpStatusCode.OK).json({ message: "Logged out successfully" });
  }
}
