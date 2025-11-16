import { IPasswordHasher } from "../../application/services/IPasswordHasher";
import { IGenerateUserID } from "../../application/services/IGenerateUserID";
import { ITokenService } from "../../application/services/ITokenService";
import { ILogger } from "../../application/interfaces/ILogger";

import { IRegisterUserUseCase } from "../../application/interfaces/IRegisterUserUseCase";
import { ILoginUserUseCase } from "../../application/interfaces/ILoginUserUseCase";
import { IGetCurrentUserUseCase } from "../../application/interfaces/IGetCurrentUserUseCase";
import { ISendOtpUseCase } from "../../application/interfaces/ISendOtpUseCase";
import { IVerifyOtpUseCase } from "../../application/interfaces/IVerifyOtpUseCase";

import { BcryptPasswordHasher } from "../utils/BcryptPasswordHasher";
import { UUIDGenerator } from "../utils/UUIDGenerator";
import { JwtTokenService } from "../utils/JwtTokenService";
import { loggerInstance } from "../logger/Logger";

import { UserRepositoryFactory } from "../repo/UserRepositoryFactory";
import { OtpRepository } from "../repo/OtpRepository";

import { RegisterUserUseCase } from "../../application/use-cases/RegisterUserUseCase";
import { LoginUserUseCase } from "../../application/use-cases/LoginUserUseCase";
import { GetCurrentUserUseCase } from "../../application/use-cases/GetCurrentUserUseCase";
import { SendOtpUseCase } from "../../application/use-cases/SendOtpUseCase";
import { VerifyOtpUseCase } from "../../application/use-cases/VerifyOtpUseCase";

import { OtpService } from "../utils/OtpService";
import { NodemailerEmailService } from "../utils/NodemailerEmailService";

import { AuthController } from "../../presentation/controllers/AuthController";
import { AuthMiddleware } from "../../presentation/middlewares/AuthMiddleware";


export class DIContainer {
  // -------------------------
  // Infrastructure Layer
  // -------------------------
  private _repositoryFactory?: UserRepositoryFactory;
  private _otpRepository?: OtpRepository;

  private _passwordHasher?: IPasswordHasher;
  private _idGenerator?: IGenerateUserID;
  private _tokenService?: ITokenService;
  private _logger?: ILogger;

  private _otpService?: OtpService;
  private _emailService?: NodemailerEmailService;

  // -------------------------
  // Application Layer
  // -------------------------
  private _registerUserUseCase?: IRegisterUserUseCase;
  private _loginUserUseCase?: ILoginUserUseCase;
  private _getCurrentUserUseCase?: IGetCurrentUserUseCase;

  private _sendOtpUseCase?: ISendOtpUseCase;
  private _verifyOtpUseCase?: IVerifyOtpUseCase;

  // -------------------------
  // Presentation Layer
  // -------------------------
  private _authController?: AuthController;
  private _authMiddleware?: AuthMiddleware;


  // ==========================================
  // Infrastructure Lazy Getters
  // ==========================================

  get repositoryFactory(): UserRepositoryFactory {
    if (!this._repositoryFactory) {
      this._repositoryFactory = new UserRepositoryFactory();
    }
    return this._repositoryFactory;
  }

  get otpRepository(): OtpRepository {
    if (!this._otpRepository) {
      this._otpRepository = new OtpRepository();
    }
    return this._otpRepository;
  }

  get passwordHasher(): IPasswordHasher {
    if (!this._passwordHasher) {
      this._passwordHasher = new BcryptPasswordHasher();
    }
    return this._passwordHasher;
  }

  get idGenerator(): IGenerateUserID {
    if (!this._idGenerator) {
      this._idGenerator = new UUIDGenerator();
    }
    return this._idGenerator;
  }

  get tokenService(): ITokenService {
    if (!this._tokenService) {
      this._tokenService = new JwtTokenService(
        process.env.ACCESS_TOKEN_SECRET ?? "default-access-secret",
        process.env.REFRESH_TOKEN_SECRET ?? "default-refresh-secret"
      );
    }
    return this._tokenService;
  }

  get logger(): ILogger {
    if (!this._logger) this._logger = loggerInstance;
    return this._logger;
  }

  get otpService(): OtpService {
    if (!this._otpService) {
      this._otpService = new OtpService();
    }
    return this._otpService;
  }

  get emailService(): NodemailerEmailService {
    if (!this._emailService) {
      this._emailService = new NodemailerEmailService();
    }
    return this._emailService;
  }

  // ==========================================
  // Application Layer Lazy Getters
  // ==========================================

  get registerUserUseCase(): IRegisterUserUseCase {
    if (!this._registerUserUseCase) {
      this._registerUserUseCase = new RegisterUserUseCase(
        this.repositoryFactory,
        this.passwordHasher,
        this.idGenerator,
        this.tokenService,
        this.logger
      );
    }
    return this._registerUserUseCase;
  }

  get loginUserUseCase(): ILoginUserUseCase {
    if (!this._loginUserUseCase) {
      this._loginUserUseCase = new LoginUserUseCase(
        this.repositoryFactory,
        this.passwordHasher,
        this.tokenService,
        this.logger
      );
    }
    return this._loginUserUseCase;
  }

  get getCurrentUserUseCase(): IGetCurrentUserUseCase {
    if (!this._getCurrentUserUseCase) {
      this._getCurrentUserUseCase = new GetCurrentUserUseCase(
        this.repositoryFactory,
        this.logger
      );
    }
    return this._getCurrentUserUseCase;
  }



  get sendOtpUseCase(): ISendOtpUseCase {
    if (!this._sendOtpUseCase) {
      this._sendOtpUseCase = new SendOtpUseCase(
        this.emailService,
        this.otpService,
        this.otpRepository,
        this.repositoryFactory,
        this.logger
      );
    }
    return this._sendOtpUseCase;
  }

  get verifyOtpUseCase(): IVerifyOtpUseCase {
    if (!this._verifyOtpUseCase) {
      this._verifyOtpUseCase = new VerifyOtpUseCase(
        this.otpService,
        this.otpRepository,
        this.logger
      );
    }
    return this._verifyOtpUseCase;
  }


  // ==========================================
  // Presentation Layer
  // ==========================================

  get authController(): AuthController {
    if (!this._authController) {
      this._authController = new AuthController(
        this.registerUserUseCase,
        this.loginUserUseCase,
        this.getCurrentUserUseCase,
        this.sendOtpUseCase,
        this.verifyOtpUseCase
      );
    }
    return this._authController;
  }

  get authMiddleware(): AuthMiddleware {
    if (!this._authMiddleware) {
      this._authMiddleware = new AuthMiddleware(this.tokenService);
    }
    return this._authMiddleware;
  }
}
