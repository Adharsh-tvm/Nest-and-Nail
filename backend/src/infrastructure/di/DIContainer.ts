import { IPasswordHasher } from "../../application/services/IPasswordHasher";
import { IGenerateUserID } from "../../application/services/IGenerateUserID";
import { ITokenService } from "../../application/services/ITokenService";
import { ILogger } from "../../application/interfaces/ILogger";
import { IRegisterUserUseCase } from "../../application/interfaces/IRegisterUserUseCase";
import { ILoginUserUseCase } from "../../application/interfaces/ILoginUserUseCase";
import { IGetCurrentUserUseCase } from "../../application/interfaces/IGetCurrentUserUseCase";
import { BcryptPasswordHasher } from "../utils/BcryptPasswordHasher";
import { UUIDGenerator } from "../utils/UUIDGenerator";
import { JwtTokenService } from "../utils/JwtTokenService";
import { loggerInstance } from "../logger/Logger";
import { UserRepositoryFactory } from "../repo/UserRepositoryFactory";
import { RegisterUserUseCase } from "../../application/use-cases/RegisterUserUseCase";
import { LoginUserUseCase } from "../../application/use-cases/LoginUserUseCase";
import { GetCurrentUserUseCase } from "../../application/use-cases/GetCurrentUserUseCase";
import { AuthController } from "../../presentation/controllers/AuthController";
import { AuthMiddleware } from "../../presentation/middlewares/AuthMiddleware";

export class DIContainer {
  // Infrastructure Layer
  private _repositoryFactory?: UserRepositoryFactory;
  private _passwordHasher?: IPasswordHasher;
  private _idGenerator?: IGenerateUserID;
  private _tokenService?: ITokenService;
  private _logger?: ILogger;

  // Application Layer
  private _registerUserUseCase?: IRegisterUserUseCase;
  private _loginUserUseCase?: ILoginUserUseCase;
  private _getCurrentUserUseCase?: IGetCurrentUserUseCase;

  // Presentation Layer
  private _authController?: AuthController;
  private _authMiddleware?: AuthMiddleware;

  // Infrastructure Layer Getters (Lazy Initialization)
  get repositoryFactory(): UserRepositoryFactory {
    if (!this._repositoryFactory) {
      this._repositoryFactory = new UserRepositoryFactory();
    }
    return this._repositoryFactory;
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
    if (!this._logger) {
      this._logger = loggerInstance;
    }
    return this._logger;
  }

  // Application Layer Getters (Lazy Initialization)
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

  // Presentation Layer Getters (Lazy Initialization)
  get authController(): AuthController {
    if (!this._authController) {
      this._authController = new AuthController(
        this.registerUserUseCase,
        this.loginUserUseCase,
        this.getCurrentUserUseCase
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