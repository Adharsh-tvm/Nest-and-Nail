import { Request, Response } from "express";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { loggerInstance } from "../../infrastructure/logger/Logger";
import { IAuthController } from "../interfaces/IAuthController";
import { IRegisterUserUseCase } from "../../application/interfaces/IRegisterUserUseCase";
import { ILoginUserUseCase } from "../../application/interfaces/ILoginUserUseCase";
import { ISendOtpUseCase } from "../../application/interfaces/ISendOtpUseCase";
import { IVerifyOtpUseCase } from "../../application/interfaces/IVerifyOtpUseCase";
import { IForgotPasswordUseCase } from "../../application/interfaces/IForgotPasswordUseCase";
import { IResetPasswordUseCase } from "../../application/interfaces/IResetPasswordUseCase";
import { IRefreshTokenUseCase } from "../../application/interfaces/IRefreshTokenUseCase";
import { ResponseHandler } from "../responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../responses/ResponseMessages";

export class AuthController implements IAuthController {

  constructor(
    private readonly _registerUserUseCase: IRegisterUserUseCase,
    private readonly _loginUserUseCase: ILoginUserUseCase,
    private readonly _sendOtpUseCase: ISendOtpUseCase,
    private readonly _verifyOtpUseCase: IVerifyOtpUseCase,
    private readonly _refreshTokenUseCase: IRefreshTokenUseCase,
    private readonly _forgotPasswordUseCase: IForgotPasswordUseCase,
    private readonly _resetPasswordUseCase: IResetPasswordUseCase
  ) { }

  // ---------------- REGISTER ----------------
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { user_role, email_address, password } = req.body;

      if (!user_role) {
        res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, "user_role is required")
        );
      }

      loggerInstance.info(`[AuthController] Register request for ${email_address}`);

      await this._registerUserUseCase.execute(req.body);

      const loginResult = await this._loginUserUseCase.execute({
        email_address,
        password
      });

      res.status(HttpStatusCode.CREATED).json(
        ResponseHandler.success(
          {
            user: loginResult.user,
            accessToken: loginResult.accessToken,
            refreshToken: loginResult.refreshToken
          },
          RESPONSE_MESSAGES.REGISTER_SUCCESS
        )
      );

    } catch (error: unknown) {
      loggerInstance.error("[AuthController] Register error:", error);

      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, error)
      );
    }
  }

  // ---------------- LOGIN ----------------
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email_address, password } = req.body;

      if (!email_address || !password) {
        res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error(
            RESPONSE_MESSAGES.BAD_REQUEST,
            "email_address and password are required"
          )
        );
      }

      const result = await this._loginUserUseCase.execute({ email_address, password });

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(
          {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
          },
          RESPONSE_MESSAGES.LOGIN_SUCCESS
        )
      );

    } catch (error: unknown) {
      loggerInstance.error("[AuthController] Login error:", error);

      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.INVALID_CREDENTIALS, error)
      );
    }
  }

  // ---------------- SEND OTP ----------------
  sendOtp = async (req: Request, res: Response) => {
    try {
      const email = req.body.email || req.body.email_address;
      const role = req.body.role || req.body.user_role;

      if (!email || !role) {
        return res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, "Email and role are required")
        );
      }

      await this._sendOtpUseCase.execute(email, role);

      return res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(null, RESPONSE_MESSAGES.OTP_SENT)
      );

    } catch (error: unknown) {
      return res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, error)
      );
    }
  };

  // ---------------- VERIFY OTP ----------------
  verifyOtp = async (req: Request, res: Response) => {
    try {
      const email = req.body.email || req.body.email_address;
      const otp = req.body.otp;

      const result = await this._verifyOtpUseCase.execute(email, otp);

      if (!result) {
        return res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, "Invalid OTP")
        );
      }

      return res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(null, RESPONSE_MESSAGES.OTP_VERIFIED)
      );

    } catch (error: unknown) {
      return res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, error)
      );
    }
  };

  // ---------------- LOGOUT ----------------
  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(null, RESPONSE_MESSAGES.LOGOUT_SUCCESS)
    );
  }

  // ---------------- FORGOT PASSWORD ----------------
  forgotPassword = async (req: Request, res: Response) => {
    try {
      const email = req.body.email_address || req.body.email;

      if (!email) {
        return res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, "Email is required")
        );
      }

      const result = await this._forgotPasswordUseCase.execute(email);

      return res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(result, RESPONSE_MESSAGES.OTP_SENT)
      );

    } catch (error: unknown) {
      return res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, error)
      );
    }
  };

  // ---------------- RESET PASSWORD ----------------
  resetPassword = async (req: Request, res: Response) => {
    try {
      const email = req.body.email || req.body.email_address;
      const { newPassword, confirmPassword } = req.body;

      if (!email || !newPassword || !confirmPassword) {
        return res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, "Missing required fields")
        );
      }

      if (newPassword !== confirmPassword) {
        return res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error(RESPONSE_MESSAGES.PASSWORD_MISMATCH)
        );
      }

      await this._resetPasswordUseCase.execute(email, newPassword);

      return res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(null, RESPONSE_MESSAGES.SUCCESS)
      );

    } catch (error: unknown) {
      return res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, error)
      );
    }
  };

  // ---------------- REFRESH TOKEN ----------------
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        res.status(HttpStatusCode.UNAUTHORIZED).json(
          ResponseHandler.error(RESPONSE_MESSAGES.REFRESH_TOKEN_MISSING)
        );
      }

      const tokens = await this._refreshTokenUseCase.execute(refreshToken);

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(
          {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
          },
          RESPONSE_MESSAGES.TOKEN_REFRESH_SUCCESS
        )
      );

    } catch (error: unknown) {
      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.INVALID_REFRESH_TOKEN, error)
      );
    }
  }
}
