import { Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpCodes";
import { IRegisterClientUseCase } from "../../application/interfaces/IRegisterClientUseCase";
import { ILoginClientUseCase } from "../../application/interfaces/ILoginClientUseCase";
import { IGetCurrentUserUseCase } from "../../application/interfaces/IGetCurrentUserUseCase";
import { loggerInstance } from "../../infrastructure/logger/Logger";

export class AuthController {
  constructor(
    private readonly _registerClient: IRegisterClientUseCase,
    private readonly _loginClient: ILoginClientUseCase,
    private readonly _getCurrentUser: IGetCurrentUserUseCase,
  ) { }

  //  REGISTER
  async register(req: Request, res: Response) {
    try {
      const user = await this._registerClient.execute(req.body);
      res.status(HttpStatusCode.CREATED).json(user);
    } catch (error: any) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
    }
  }

  //  LOGIN — sets HttpOnly cookies
  async login(req: Request, res: Response) {
    try {
      loggerInstance.info(`Login attempt from ${req.body.email}`);
      const result = await this._loginClient.execute(req.body);
      const { accessToken, refreshToken, user } = result;

      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000, // 15 mins
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .status(HttpStatusCode.OK)
        .json({ user });
    } catch (error: any) {
      res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ message: error.message });
    }
  }



  async me(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }

      const user = await this._getCurrentUser.execute(req.user.id);
      res.status(HttpStatusCode.OK).json({ user });
    } catch (error: any) {
      res
        .status(HttpStatusCode.FORBIDDEN)
        .json({ message: "Failed to fetch user" });
    }
  }

  //  LOGOUT — clears cookies
  async logout(req: Request, res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(HttpStatusCode.OK).json({ message: "Logged out successfully" });
  }
}
