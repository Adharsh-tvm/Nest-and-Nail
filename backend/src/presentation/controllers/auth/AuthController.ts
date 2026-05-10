import { Request, Response } from "express";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { IAuthController } from "../../interfaces/IAuthController";
import { ILogger } from "../../../infrastructure/logger/ILogger";
import { IRegisterUserUseCase } from "../../../application/interfaces/auth/IRegisterUserUseCase";
import { ILoginUserUseCase } from "../../../application/interfaces/auth/ILoginUserUseCase";
import { ISendOtpUseCase } from "../../../application/interfaces/auth/ISendOtpUseCase";
import { IVerifyOtpUseCase } from "../../../application/interfaces/auth/IVerifyOtpUseCase";
import { IForgotPasswordUseCase } from "../../../application/interfaces/auth/IForgotPasswordUseCase";
import { IResetPasswordUseCase } from "../../../application/interfaces/auth/IResetPasswordUseCase";
import { IRefreshTokenUseCase } from "../../../application/interfaces/auth/IRefreshTokenUseCase";
import { IValidateUserUseCase } from "../../../application/interfaces/auth/IValidateUserUseCase";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";
import { UserRequestDTO } from "../../../application/dtos/UserDTO";
import { IChangePasswordUseCase } from "../../../application/interfaces/auth/IChangePasswordUseCase";

export class AuthController implements IAuthController {

  constructor(
    private readonly _registerUserUseCase: IRegisterUserUseCase,
    private readonly _loginUserUseCase: ILoginUserUseCase,
    private readonly _sendOtpUseCase: ISendOtpUseCase,
    private readonly _verifyOtpUseCase: IVerifyOtpUseCase,
    private readonly _refreshTokenUseCase: IRefreshTokenUseCase,
    private readonly _forgotPasswordUseCase: IForgotPasswordUseCase,
    private readonly _resetPasswordUseCase: IResetPasswordUseCase,
    private readonly _validateUserUseCase: IValidateUserUseCase,
    private readonly _changePasswordUseCase: IChangePasswordUseCase,
    private readonly _logger: ILogger
  ) { }

  // ---------------- REGISTER ----------------
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { user_role, email_address, password } = req.body as { user_role?: string; email_address?: string; password?: string };

      if (!user_role) {
        res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, "user_role is required")
        );
      }

      this._logger.info(`[AuthController] Register request for ${email_address ?? ""}`);

      await this._registerUserUseCase.execute(req.body as UserRequestDTO);

      const loginResult = await this._loginUserUseCase.execute({
        email_address: email_address ?? "",
        password: password ?? ""
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
      this._logger.error("[AuthController] Register error:", error);

      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, error)
      );
    }
  }

  // ---------------- LOGIN ----------------
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email_address, password } = req.body as { email_address?: string; password?: string };

      if (!email_address || !password) {
        res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error(
            RESPONSE_MESSAGES.BAD_REQUEST,
            "email_address and password are required"
          )
        );
      }

      const result = await this._loginUserUseCase.execute({ email_address: email_address ?? "", password: password ?? "" });

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
      this._logger.error("[AuthController] Login error:", error);

      res.status(HttpStatusCode.UNAUTHORIZED).json(
        ResponseHandler.error(RESPONSE_MESSAGES.INVALID_CREDENTIALS, error)
      );
    }
  }

  // ---------------- SEND OTP ----------------
  async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as { email?: string; email_address?: string; role?: string; user_role?: string };
      const email = body.email ?? body.email_address;
      const role = body.role ?? body.user_role;

      if (!email || !role) {
        res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, "Email and role are required")
        );
      }

      await this._sendOtpUseCase.execute(email ?? "", role ?? "");

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(null, RESPONSE_MESSAGES.OTP_SENT)
      );

    } catch (error: unknown) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, error)
      );
    }
  };

  // ---------------- VERIFY OTP ----------------
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as { email?: string; email_address?: string; otp?: string };
      const email = body.email ?? body.email_address;
      const otp = body.otp;

      const result = await this._verifyOtpUseCase.execute(email ?? "", otp ?? "");

      if (!result) {
        res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error(RESPONSE_MESSAGES.INVALID_OTP, "Invalid or expired OTP")
        );
        return;
      }

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(null, RESPONSE_MESSAGES.OTP_VERIFIED)
      );
      return;

    } catch (error: unknown) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, error)
      );
    }
  }


  logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(null, RESPONSE_MESSAGES.LOGOUT_SUCCESS)
    );
    return Promise.resolve();
  }

  // ---------------- FORGOT PASSWORD ----------------
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as { email_address?: string; email?: string };
      const email = body.email_address ?? body.email;

      if (!email) {
        res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, "Email is required")
        );
      }

      const result = await this._forgotPasswordUseCase.execute(email ?? "");

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(result, RESPONSE_MESSAGES.OTP_SENT)
      );

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : RESPONSE_MESSAGES.BAD_REQUEST;
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(message, error)
      );
    }
  };

  // ---------------- RESET PASSWORD ----------------
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as { email?: string; email_address?: string; newPassword?: string; confirmPassword?: string };
      const email = body.email ?? body.email_address;
      const { newPassword, confirmPassword } = body;

      if (!email || !newPassword || !confirmPassword) {
        res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, "Missing required fields")
        );
      }

      if (newPassword !== confirmPassword) {
        res.status(HttpStatusCode.BAD_REQUEST).json(
          ResponseHandler.error(RESPONSE_MESSAGES.PASSWORD_MISMATCH)
        );
      }

      await this._resetPasswordUseCase.execute(email ?? "", newPassword ?? "");

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(null, RESPONSE_MESSAGES.SUCCESS)
      );

    } catch (error: unknown) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST, error)
      );
    }
  };

  // ---------------- REFRESH TOKEN ----------------
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const cookies = req.cookies as { refreshToken?: string };
      const body = req.body as { refreshToken?: string };
      const refreshToken = cookies.refreshToken ?? body.refreshToken;

      console.log("reeeeeeeeeeeeeeeefrrrrrrrreeeeessssssssh ")

      if (!refreshToken) {
        res.status(HttpStatusCode.UNAUTHORIZED).json(
          ResponseHandler.error(RESPONSE_MESSAGES.REFRESH_TOKEN_MISSING)
        );
      }

      const tokens = await this._refreshTokenUseCase.execute(refreshToken ?? "");

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

  // ---------------- VALIDATE ----------------
  async validate(req: Request, res: Response): Promise<void> {
    try {
      // Assuming AuthMiddleware has already attached the user payload to req.user
      // or we decode it here. Since middleware is used, req.user should be available.
      // However, to be safe and consistent with the plan, we might extracting from token 
      // or relying on middleware. 
      // The plan says "GET /validate", and middleware will start implementing it.
      // Let's assume the route is protected and req.user.id is available.

      const userId = req.user?.id;

      if (!userId) {
        res.status(HttpStatusCode.UNAUTHORIZED).json(
          ResponseHandler.error("Unauthorized")
        );
        return;
      }

      const result = await this._validateUserUseCase.execute(userId);

      if (!result.success) {
        res.status(HttpStatusCode.OK).json({ 
          success: false,
          message: result.message
        });
        return;
      }

      res.status(HttpStatusCode.OK).json({
        success: true,
        payload: result.payload
      });

    } catch (error: unknown) {
      res.status(HttpStatusCode.INTERNAL_SERVER).json(
        ResponseHandler.error("Internal Server Error", error)
      );
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      const { currentPassword, newPassword, confirmPassword } = req.body as { currentPassword?: string; newPassword?: string; confirmPassword?: string };

      if (!userId) {
        res.status(HttpStatusCode.UNAUTHORIZED).json(ResponseHandler.error("Unauthorized"));
        return;
      }

      if (!currentPassword || !newPassword || !confirmPassword) {
        res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHandler.error("All fields are required"));
        return;
      }

      if (newPassword !== confirmPassword) {
        res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHandler.error("Passwords do not match"));
        return;
      }

      await this._changePasswordUseCase.execute(
        userId,
        currentPassword,
        newPassword
      );

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(null, "Password changed successfully")
      );

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to change password";
      res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHandler.error(message));
    }
  }
}
