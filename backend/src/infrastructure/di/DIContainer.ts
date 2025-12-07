// Adjust path to where you keep DIContainer; this path is example: src/infrastructure/di/DIContainer.ts

import { IPasswordHasher } from "../../application/services/IPasswordHasher";
import { IGenerateUserID } from "../../application/services/IGenerateUserID";
import { ITokenService } from "../../application/services/ITokenService";
import { ILogger } from "../../application/interfaces/ILogger";

import { IRegisterUserUseCase } from "../../application/interfaces/IRegisterUserUseCase";
import { ILoginUserUseCase } from "../../application/interfaces/ILoginUserUseCase";
import { ISendOtpUseCase } from "../../application/interfaces/ISendOtpUseCase";
import { IVerifyOtpUseCase } from "../../application/interfaces/IVerifyOtpUseCase";

import { BcryptPasswordHasher } from "../services/BcryptPasswordHasher";
import { UUIDGenerator } from "../services/UUIDGenerator";
import { JwtTokenService } from "../services/JwtTokenService";
import { loggerInstance } from "../logger/Logger";

import { UserRepositoryFactory } from "../repo/UserRepositoryFactory";
import { OtpRepository } from "../repo/OtpRepository";

import { RegisterUserUseCase } from "../../application/use-cases/RegisterUserUseCase";
import { LoginUserUseCase } from "../../application/use-cases/LoginUserUseCase";
import { SendOtpUseCase } from "../../application/use-cases/SendOtpUseCase";
import { VerifyOtpUseCase } from "../../application/use-cases/VerifyOtpUseCase";

import { OtpService } from "../services/OtpService";
import { NodemailerEmailService } from "../services/NodemailerEmailService";

import { AuthController } from "../../presentation/controllers/AuthController";
import { AuthMiddleware } from "../../presentation/middlewares/AuthMiddleware";
import { IGoogleSignUpUseCase } from "../../application/interfaces/IGoogleSignUpUseCase";
import { GoogleAuthController } from "../../presentation/controllers/GoogleAuthController";
import { IGoogleAuthService } from "../../application/services/IGoogleAuthService";
import { GoogleAuthService } from "../services/GoogleAuthService";
import { GoogleSignUpUseCase } from "../../application/use-cases/GoogleSignUpUseCase";
import { IGetAllClientsUseCase } from "../../application/interfaces/IGetAllClientsUseCase";
import { GetAllClientsUseCase } from "../../application/use-cases/GetAllClientsUseCase";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { ClientRepository } from "../repo/ClientRepository";
import { IAuthController } from "../../presentation/interfaces/IAuthController";
import { IAdminController } from "../../presentation/interfaces/IAdminController";
import { IGoogleAuthController } from "../../presentation/interfaces/IGoogleAuthController";
import { AdminController } from "../../presentation/controllers/AdminController";
import { IGetAllWorkersUseCase } from "../../application/interfaces/IGetAllWorkersUseCase";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { WorkerRepository } from "../repo/WorkerRepository";
import { GetAllWorkersUseCase } from "../../application/use-cases/GetAllWorkersUseCase";
import { IForgotPasswordUseCase } from "../../application/interfaces/IForgotPasswordUseCase";
import { ForgotPasswordUseCase } from "../../application/use-cases/ForgotPasswordUseCase";
import { IResetPasswordUseCase } from "../../application/interfaces/IResetPasswordUseCase";
import { ResetPasswordUseCase } from "../../application/use-cases/ResetPasswordUseCase";
import { IChangeUserRoleUseCase } from "../../application/interfaces/IChangeUserRoleUseCase";
import { ChangeUserRoleUseCase } from "../../application/use-cases/ChangeUserRoleUseCase";
import { IUserController } from "../../presentation/interfaces/IUserController";
import { UserController } from "../../presentation/controllers/UserController";
import { IGetCurrentUserUseCase } from "../../application/interfaces/IGetCurrentUserUseCase";
import { GetCurrentUserUseCase } from "../../application/use-cases/GetCurrentUserUseCase";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { User } from "../../domain/entities/User";
import { IUploadProfilePictureUseCase } from "../../application/interfaces/IUploadProfilePictureUseCase";
import { IUploadWorkerDocumentUseCase } from "../../application/interfaces/IUploadWorkerDocumentUseCase";
import { UploadProfilePictureUseCase } from "../../application/use-cases/UploadProfilePictureUseCase";
import { UploadWorkerDocumentUseCase } from "../../application/use-cases/UploadWorkerDocumentUseCase";
import { IUploadController } from "../../presentation/interfaces/IUploadController";
import { UploadController } from "../../presentation/controllers/UploadController";

export class DIContainer {
  // -------------------------
  // Infrastructure Layer
  // -------------------------
  private _userRepositoryFactory?: UserRepositoryFactory;
  private _clientRepository?: IClientRepository;
  private _workerRepository?: IWorkerRepository;
  private _otpRepository?: OtpRepository;
  private __baseRepository?: IBaseRepository<User>;



  private _passwordHasher?: IPasswordHasher;
  private _idGenerator?: IGenerateUserID;
  private _tokenService?: ITokenService;
  private _logger?: ILogger;

  private _otpService?: OtpService;
  private _emailService?: NodemailerEmailService;
  private _googleAuthService?: IGoogleAuthService;

  // -------------------------
  // Application Layer
  // -------------------------
  private _registerUserUseCase?: IRegisterUserUseCase;
  private _loginUserUseCase?: ILoginUserUseCase;

  private _sendOtpUseCase?: ISendOtpUseCase;
  private _verifyOtpUseCase?: IVerifyOtpUseCase;

  private _googleLoginUseCase?: IGoogleSignUpUseCase;

  private _getAllClientsUseCase?: IGetAllClientsUseCase;
  private _getAllWorkersUseCase?: IGetAllWorkersUseCase;

  private _forgotpasswordUseCase?: IForgotPasswordUseCase;
  private _resetPasswordUseCase?: IResetPasswordUseCase;

  private _changeUserRoleuseCase?: IChangeUserRoleUseCase;
  private _getCurrentUserUseCase?: IGetCurrentUserUseCase;

  private _uploadProfilePictureUseCase?: IUploadProfilePictureUseCase;
  private _uploadWorkerDocumentUseCase?: IUploadWorkerDocumentUseCase;

  // -------------------------
  // Presentation Layer
  // -------------------------
  private _authController?: IAuthController;
  private _authMiddleware?: AuthMiddleware;

  private _googleAuthController?: IGoogleAuthController;
  private _adminController?: IAdminController;
  private _userController?: IUserController;

  private _uploadController?: IUploadController;


  // ==========================================
  // Infrastructure Lazy Getters
  // ==========================================

  get userRepositoryFactory(): UserRepositoryFactory {
    if (!this._userRepositoryFactory) {
      this._userRepositoryFactory = new UserRepositoryFactory();
    }
    return this._userRepositoryFactory;
  }

  get clientRepository(): IClientRepository {
    if (!this._clientRepository) {
      this._clientRepository = new ClientRepository();
    }
    return this._clientRepository;
  }

  get workerRepository(): IWorkerRepository {
    if (!this._workerRepository) {
      this._workerRepository = new WorkerRepository()
    }
    return this._workerRepository;
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
        this.userRepositoryFactory,
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
        this.userRepositoryFactory,
        this.passwordHasher,
        this.tokenService,
        this.logger
      );
    }
    return this._loginUserUseCase;
  }

  get getAllClientsUseCase(): IGetAllClientsUseCase {
    if (!this._getAllClientsUseCase) {
      this._getAllClientsUseCase = new GetAllClientsUseCase(this.clientRepository);
    }
    return this._getAllClientsUseCase;
  }

  get getAllWorkersUseCase(): IGetAllWorkersUseCase {
    if (!this._getAllWorkersUseCase) {
      this._getAllWorkersUseCase = new GetAllWorkersUseCase(this.workerRepository);
    }
    return this._getAllWorkersUseCase;
  }

  get googleLoginUseCase(): IGoogleSignUpUseCase {
    if (!this._googleLoginUseCase) {
      this._googleLoginUseCase = new GoogleSignUpUseCase(
        this.userRepositoryFactory,
        this.passwordHasher,
        this.tokenService,
        this.googleAuthService,
        this.idGenerator
      );
    }
    return this._googleLoginUseCase;
  }

  get sendOtpUseCase(): ISendOtpUseCase {
    if (!this._sendOtpUseCase) {
      this._sendOtpUseCase = new SendOtpUseCase(
        this.emailService,
        this.otpService,
        this.otpRepository,
        this.userRepositoryFactory,
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
        this.logger);
    }
    return this._verifyOtpUseCase;
  }

  get forgotPasswordUseCase(): IForgotPasswordUseCase {
    if (!this._forgotpasswordUseCase) {
      this._forgotpasswordUseCase = new ForgotPasswordUseCase(
        this.emailService,
        this.otpService,
        this.otpRepository,
        this.userRepositoryFactory);
    }
    return this._forgotpasswordUseCase;
  }

  get resetPasswordUseCase(): IResetPasswordUseCase {
    if (!this._resetPasswordUseCase) {
      this._resetPasswordUseCase = new ResetPasswordUseCase(
        this.userRepositoryFactory,
        this.passwordHasher,
        this.otpRepository,
        this.logger);
    }
    return this._resetPasswordUseCase;
  }

  get changeUserRoleUseCase(): IChangeUserRoleUseCase {
    if (!this._changeUserRoleuseCase) {
      this._changeUserRoleuseCase = new ChangeUserRoleUseCase(
        this.userRepositoryFactory,
        this.logger,
        this.tokenService
      )
    }
    return this._changeUserRoleuseCase
  }

  get getCurrentUserUseCase(): IGetCurrentUserUseCase {
    if (!this._getCurrentUserUseCase) {
      this._getCurrentUserUseCase = new GetCurrentUserUseCase(
        this.userRepositoryFactory,
        this.logger
      );
    }
    return this._getCurrentUserUseCase;
  }

  get uploadProfilePictureUseCase(): IUploadProfilePictureUseCase {
    if (!this._uploadProfilePictureUseCase) {
      this._uploadProfilePictureUseCase = new UploadProfilePictureUseCase(
        this.userRepositoryFactory,
        this.logger
      );
    }
    return this._uploadProfilePictureUseCase;
  }

  get uploadWorkerDocumentUseCase(): IUploadWorkerDocumentUseCase {
    if (!this._uploadWorkerDocumentUseCase) {
      this._uploadWorkerDocumentUseCase = new UploadWorkerDocumentUseCase(
        this.userRepositoryFactory,
        this.logger
      );
    }
    return this._uploadWorkerDocumentUseCase;
  }


  // ==========================================
  // Presentation Layer
  // ==========================================

  get authController(): IAuthController {
    if (!this._authController) {
      this._authController = new AuthController(
        this.registerUserUseCase,
        this.loginUserUseCase,
        this.sendOtpUseCase,
        this.verifyOtpUseCase,
        this.forgotPasswordUseCase,
        this.resetPasswordUseCase);
    }
    return this._authController;
  }

  get adminController(): IAdminController {
    if (!this._adminController) {
      this._adminController = new AdminController(
        this.getAllClientsUseCase,
        this.getAllWorkersUseCase
      );
    }
    return this._adminController;
  }

  get googleAuthController(): IGoogleAuthController {
    if (!this._googleAuthController) {
      this._googleAuthController = new GoogleAuthController(
        this.googleLoginUseCase
      );
    }
    return this._googleAuthController;
  }

  get userController(): IUserController {
    if (!this._userController) {
      this._userController = new UserController(
        this.changeUserRoleUseCase,
        this.getCurrentUserUseCase
      )
    }
    return this._userController;
  }

  get googleAuthService(): IGoogleAuthService {
    if (!this._googleAuthService) {
      this._googleAuthService = new GoogleAuthService();
    }
    return this._googleAuthService;
  }

  get authMiddleware(): AuthMiddleware {
    if (!this._authMiddleware) {
      this._authMiddleware = new AuthMiddleware(this.tokenService);
    }
    return this._authMiddleware;
  }

  get uploadController(): IUploadController {
    if (!this._uploadController) {
      this._uploadController = new UploadController(
        this.uploadProfilePictureUseCase,
        this.uploadWorkerDocumentUseCase,
      );
    }
    return this._uploadController;
  }

}
