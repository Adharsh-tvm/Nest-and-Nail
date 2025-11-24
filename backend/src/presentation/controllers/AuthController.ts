import { Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpCodes";
import { loggerInstance } from "../../infrastructure/logger/Logger";
import { IAuthController } from "../interfaces/IAuthController";
import { IRegisterUserUseCase } from "../../application/interfaces/IRegisterUserUseCase";
import { ILoginUserUseCase } from "../../application/interfaces/ILoginUserUseCase";
import { ISendOtpUseCase } from "../../application/interfaces/ISendOtpUseCase";
import { IVerifyOtpUseCase } from "../../application/interfaces/IVerifyOtpUseCase";

export class AuthController implements IAuthController {
  constructor(
    private readonly _registerUserUseCase: IRegisterUserUseCase,
    private readonly _loginUserUseCase: ILoginUserUseCase,
    private readonly _sendOtpUseCase: ISendOtpUseCase,
    private readonly _verifyOtpUseCase: IVerifyOtpUseCase,
  ) { }

  async register(req: Request, res: Response): Promise<void> {
    try {
      loggerInstance.info(`[AuthController] Register request for ${req.body.email_address}`);

      const { user_role } = req.body;

      if (!user_role) {
        loggerInstance.error("[AuthController] Missing user_role in request");
        res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "user_role is required for registration"
        });
        return;
      }

      // Register the user
      const registrationResult = await this._registerUserUseCase.execute(req.body);

      loggerInstance.info(`[AuthController] Registration successful for ${req.body.email_address}`);

      // Login after registration (no role needed)
      const loginResult = await this._loginUserUseCase.execute({
        email_address: req.body.email_address,
        password: req.body.password
      });

      loggerInstance.info(`[AuthController] Login after registration successful`);

      const { accessToken, refreshToken, user } = loginResult;

      console.log("[AuthController] About to set cookies...");
      console.log(`[AuthController] AccessToken exists: ${!!accessToken}, length: ${accessToken?.length}`);
      console.log(`[AuthController] RefreshToken exists: ${!!refreshToken}, length: ${refreshToken?.length}`);


      console.log("[AuthController] Cookies set, sending response...");

      res.status(HttpStatusCode.CREATED).json({
        user,
        accessToken,
        refreshToken
      });

      console.log("[AuthController] Response sent successfully");

    } catch (error: any) {
      loggerInstance.error(`[AuthController] Registration error: ${error.message}`);
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: error.message || "Registration failed"
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email_address, password } = req.body;

      if (!email_address || !password) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "email_address and password are required"
        });
        return;
      }

      loggerInstance.info(`[AuthController] Login attempt from ${email_address}`);

      const result = await this._loginUserUseCase.execute({ email_address, password });

      loggerInstance.info(`[AuthController] Login successful for ${email_address}`);

      const { accessToken, refreshToken, user } = result;

      console.log("[AuthController] About to set cookies...");
      console.log(`[AuthController] AccessToken exists: ${!!accessToken}, length: ${accessToken?.length}`);
      console.log(`[AuthController] RefreshToken exists: ${!!refreshToken}, length: ${refreshToken?.length}`);


      console.log("[AuthController] Cookies set, sending response...");

      res.status(HttpStatusCode.OK).json({
        user,
        accessToken,
        refreshToken
      });

      console.log("[AuthController] Response sent successfully");

    } catch (error: any) {
      loggerInstance.error(`[AuthController] Login error: ${error.message}`);
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: error.message || "Login failed"
      });
    }
  }

  sendOtp = async (req: Request, res: Response) => {
    try {
      const email = req.body.email || req.body.email_address;
      const role = req.body.role || req.body.user_role;

      if (!email || !role) {
        return res.status(400).json({ message: "Email and role are required" });
      }

      await this._sendOtpUseCase.execute(email, role);

      return res.json({ message: "OTP sent" });

    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Failed to send OTP"
      });
    }
  };



  verifyOtp = async (req: Request, res: Response) => {
    const email = req.body.email || req.body.email_address;
    const otp = req.body.otp;
    const result = await this._verifyOtpUseCase.execute(email, otp);

    if (!result) return res.status(400).json({ message: "Invalid OTP" });

    return res.status(HttpStatusCode.OK).json({ message: "OTP verified" });
  };

  async logout(req: Request, res: Response): Promise<void> {
    console.log("[AuthController] Logout - clearing cookies");
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
    res.status(HttpStatusCode.OK).json({ message: "Logged out successfully" });
  }



}