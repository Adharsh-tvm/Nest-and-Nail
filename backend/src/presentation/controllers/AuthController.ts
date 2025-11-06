import { Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpCodes";
import { IRegisterClientUseCase } from "../../application/interfaces/IRegisterClientUseCase";
import { ILoginClientUseCase } from "../../application/interfaces/ILoginClientUseCase";
import { IGetCurrentUserUseCase } from "../../application/interfaces/IGetCurrentUserUseCase";
import { loggerInstance } from "../../infrastructure/logger/Logger";
import { IAuthController } from "../interfaces/IAuthController";
import { IGoogleAuthUseCase } from "../../application/interfaces/IGoogleAuthUseCase";
import { auth } from "../../shared/lib/auth";
import { Role } from "../../shared/enums/enums";
import { UserRequestDTO } from "../../application/dtos/UserDTO";
import { setAuthCookies } from "../utils/setAuthCookies";

export class AuthController implements IAuthController {
  constructor(
    private readonly _registerClient: IRegisterClientUseCase,
    private readonly _loginClient: ILoginClientUseCase,
    private readonly _getCurrentUser: IGetCurrentUserUseCase,
    private readonly _googleAuthClient: IGoogleAuthUseCase
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

  //Google Authentication
  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const session = await auth.api.getSession({
        headers: new Headers(
          Object.entries(req.headers).map(([key, value]) => [key, String(value)])
        )
      });
      if (!session || !session.user) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Google session missing" });
        return;
      }

      const googleUser = session.user;
      const dto: UserRequestDTO = {
        user_name: googleUser.name || "Google User",
        email_address: googleUser.email || "",
        password: "",
        phone_number: undefined,
        user_role: Role.CLIENT
      };

      const result = await this._googleAuthClient.execute(dto);
      const { user, accessToken, refreshToken } = result;

      setAuthCookies(res, accessToken, refreshToken)

      res
        .status(HttpStatusCode.OK)
        .json({ user });

    } catch (error: any) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
    }
  }


  async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const user = await this._getCurrentUser.execute(req.user.id);
      res.status(HttpStatusCode.OK).json({ user });
    } catch (error: any) {
      res.status(HttpStatusCode.FORBIDDEN).json({ message: "Failed to fetch user" });
    }
  }


  //  LOGOUT — clears cookies
  async logout(req: Request, res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(HttpStatusCode.OK).json({ message: "Logged out successfully" });
  }
}
