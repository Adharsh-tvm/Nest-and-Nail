import { Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpCodes";
import { loggerInstance } from "../../infrastructure/logger/Logger";
import { IAuthController } from "../interfaces/IAuthController";
import { setAuthCookies } from "../utils/setAuthCookies";
import { Role } from "../../shared/enums/enums";
import { UserRepositoryFactory } from "../../infrastructure/repo/UserRepositoryFactory";
import { RegisterUserUseCase } from "../../application/use-cases/RegisterUserUseCase";
import { LoginUserUseCase } from "../../application/use-cases/LoginUserUseCase";
import { GetCurrentUserUseCase } from "../../application/use-cases/GetCurrentUserUseCase";
import { IPasswordHasher } from "../../application/services/IPasswordHasher";
import { IGenerateUserID } from "../../application/services/IGenerateUserID";
import { ITokenService } from "../../application/services/ITokenService";

export class AuthController implements IAuthController {
  constructor(
    private readonly _repositoryFactory: UserRepositoryFactory,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _userIdGenerator: IGenerateUserID,
    private readonly _tokenService: ITokenService
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      loggerInstance.info(`[AuthController] Register request body: ${JSON.stringify(req.body)}`);
      
      const { user_role } = req.body;
      
      if (!user_role) {
        loggerInstance.error("[AuthController] Missing user_role in request");
        res.status(HttpStatusCode.BAD_REQUEST).json({ 
          message: "user_role is required for registration" 
        });
        return;
      }

      loggerInstance.info(`[AuthController] Getting repository for role: ${user_role}`);
      
      const repository = this._repositoryFactory.getRepository(user_role);
      
      const registerUseCase = new RegisterUserUseCase(
        repository,
        this._passwordHasher,
        this._userIdGenerator,
        this._tokenService,
        loggerInstance
      );

      loggerInstance.info(`[AuthController] Executing registration`);
      const registrationResult = await registerUseCase.execute(req.body);
      
      loggerInstance.info(`[AuthController] Registration completed successfully`);
      
      // Use the new login use case that doesn't require role
      const loginUseCase = new LoginUserUseCase(
        this._repositoryFactory,
        this._passwordHasher,
        this._tokenService,
        loggerInstance
      );

      loggerInstance.info(`[AuthController] Executing login after registration`);
      const loginResult = await loginUseCase.execute({
        email_address: req.body.email_address,
        password: req.body.password
      });
      
      const { accessToken, refreshToken, user } = loginResult;

      loggerInstance.info(`[AuthController] User object: ${JSON.stringify(user)}`);
      loggerInstance.info(`[AuthController] AccessToken exists: ${!!accessToken}`);
      loggerInstance.info(`[AuthController] RefreshToken exists: ${!!refreshToken}`);
      
      setAuthCookies(res, accessToken, refreshToken);
      
      const responseData = {
        user,
        accessToken,
        refreshToken
      };

      loggerInstance.info(`[AuthController] Sending response: ${JSON.stringify(responseData)}`);
      
      res.status(HttpStatusCode.CREATED).json(responseData);
    } catch (error: any) {
      loggerInstance.error(`[AuthController] Registration error: ${error.message}`);
      loggerInstance.error(`[AuthController] Error stack: ${error.stack}`);
      res.status(HttpStatusCode.BAD_REQUEST).json({ 
        message: error.message || "Registration failed" 
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log("=== LOGIN START ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      
      loggerInstance.info(`[AuthController] Login request body: ${JSON.stringify(req.body)}`);
      
      const { email_address, password } = req.body;

      if (!email_address) {
        console.log("ERROR: Missing email_address");
        res.status(HttpStatusCode.BAD_REQUEST).json({ 
          message: "email_address is required" 
        });
        return;
      }

      if (!password) {
        console.log("ERROR: Missing password");
        res.status(HttpStatusCode.BAD_REQUEST).json({ 
          message: "password is required" 
        });
        return;
      }
      
      console.log(`Creating login use case...`);
      loggerInstance.info(`[AuthController] Login attempt from ${email_address}`);
      
      const loginUseCase = new LoginUserUseCase(
        this._repositoryFactory,
        this._passwordHasher,
        this._tokenService,
        loggerInstance
      );

      console.log("Executing login use case...");
      loggerInstance.info(`[AuthController] Executing login use case`);
      
      const result = await loginUseCase.execute(req.body);
      
      console.log("Login use case completed");
      console.log("Result type:", typeof result);
      console.log("Result keys:", Object.keys(result));
      console.log("Result:", JSON.stringify(result, null, 2));
      
      loggerInstance.info(`[AuthController] Login result received`);
      
      if (!result) {
        console.log("ERROR: Result is null or undefined");
        throw new Error("Login use case returned null");
      }

      if (!result.user) {
        console.log("ERROR: Result.user is missing");
        throw new Error("User object is missing from login result");
      }

      if (!result.accessToken) {
        console.log("ERROR: Result.accessToken is missing");
        throw new Error("Access token is missing from login result");
      }

      if (!result.refreshToken) {
        console.log("ERROR: Result.refreshToken is missing");
        throw new Error("Refresh token is missing from login result");
      }
      
      const { accessToken, refreshToken, user } = result;

      console.log("User:", JSON.stringify(user, null, 2));
      console.log("AccessToken length:", accessToken?.length);
      console.log("RefreshToken length:", refreshToken?.length);
      
      console.log("Setting cookies...");
      setAuthCookies(res, accessToken, refreshToken);
      
      const responseData = {
        user,
        accessToken,
        refreshToken
      };

      console.log("Response data:", JSON.stringify(responseData, null, 2));
      loggerInstance.info(`[AuthController] Sending login response`);
      
      console.log("Sending response with status:", HttpStatusCode.OK);
      res.status(HttpStatusCode.OK).json(responseData);
      console.log("=== LOGIN END ===");
      
    } catch (error: any) {
      console.log("=== LOGIN ERROR ===");
      console.log("Error:", error);
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
      
      loggerInstance.error(`[AuthController] Login error: ${error.message}`);
      loggerInstance.error(`[AuthController] Error stack: ${error.stack}`);
      
      res.status(HttpStatusCode.UNAUTHORIZED).json({ 
        message: error.message || "Login failed" 
      });
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role as Role;
      
      if (!userId) {
        loggerInstance.error("[AuthController] Missing userId in token");
        res.status(HttpStatusCode.UNAUTHORIZED).json({ 
          message: "User ID not found in token" 
        });
        return;
      }
      
      if (!userRole) {
        loggerInstance.error("[AuthController] Missing role in token");
        res.status(HttpStatusCode.UNAUTHORIZED).json({ 
          message: "Role not found in token" 
        });
        return;
      }

      const repository = this._repositoryFactory.getRepository(userRole);
      
      const getCurrentUserUseCase = new GetCurrentUserUseCase(
        repository,
        loggerInstance
      );

      const userResponse = await getCurrentUserUseCase.execute(userId);
      res.status(HttpStatusCode.OK).json({ user: userResponse });
    } catch (error: any) {
      loggerInstance.error(`[AuthController] Get current user error: ${error.message}`);
      const status = error.status || HttpStatusCode.INTERNAL_SERVER;
      res.status(status).json({
        code: error.code,
        message: error.message || "Failed to get current user"
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
    res.status(HttpStatusCode.OK).json({ message: "Logged out successfully" });
  }
}