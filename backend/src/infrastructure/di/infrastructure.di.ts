import { ILogger } from "../logger/ILogger";
import { IEmailService } from "../../application/contracts/IEmailService";
import { IGenerateUserID } from "../../application/contracts/IGenerateUserID";
import { IOtpService } from "../../application/contracts/IOtpService";
import { IPasswordHasher } from "../../application/contracts/IPasswordHasher";
import { ITokenService } from "../../application/contracts/ITokenService";
import { IAdminRepository } from "../../domain/repositories/IAdminRepository";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { IUserRepositoryFactory } from "../../domain/repositories/IUserRepositoryFactory";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { loggerInstance } from "../logger/Logger";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { AdminRepository } from "../repo/AdminRepository";
import { CategoryRepository } from "../repo/CategoryRepository";
import { ClientRepository } from "../repo/ClientRepository";
import { OtpRepository } from "../repo/OtpRepository";
import { UserRepositoryFactory } from "../repo/UserRepositoryFactory";
import { UserRepository } from "../repo/UserRepository";
import { WorkerRepository } from "../repo/WorkerRepository";
import { BcryptPasswordHasher } from "../adapters/BcryptPasswordHasher";
import { JwtTokenService } from "../adapters/JwtTokenService";
import { NodemailerEmailService } from "../adapters/NodemailerEmailService";
import { OtpService } from "../adapters/OtpService";
import { UUIDGenerator } from "../adapters/UUIDGenerator";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ServiceRequestRepository } from "../repo/ServiceRequestRepository";
import { IGenerateServiceRequestId } from "../../application/contracts/IGenerateServiceRequestId";
import { ServiceRequestIdGenerator } from "../adapters/ServiceRequestIdGenerator";
import { S3Service } from "../adapters/S3service";

export class InfrastructureDI {
  private _userRepositoryFactory?: IUserRepositoryFactory;
  private _clientRepository?: IClientRepository;
  private _workerRepository?: IWorkerRepository;
  private _otpRepository?: IOtpRepository;
  private _adminRepository?: IAdminRepository;
  private _userRepository?: IBaseRepository<any>;


  private _passwordHasher?: IPasswordHasher;
  private _idGenerator?: IGenerateUserID;
  private _tokenService?: ITokenService;
  private _logger?: ILogger;

  private _otpService?: IOtpService;
  private _emailService?: IEmailService;

  private _categoryRepository?: ICategoryRepository;

  private _serviceRequestRepository?: IServiceRequestRepository;
  private _serviceRequestIdGenerator?: IGenerateServiceRequestId;

  private _s3Service?: S3Service;



  get userRepositoryFactory(): IUserRepositoryFactory {
    if (!this._userRepositoryFactory) {
      this._userRepositoryFactory = new UserRepositoryFactory(
        this.clientRepository,
        this.workerRepository,
        this.adminRepository,
        this.userRepository
      );
    }
    return this._userRepositoryFactory;
  }

  get userRepository(): IBaseRepository<any> {
    if (!this._userRepository) {
      this._userRepository = new UserRepository();
    }
    return this._userRepository;
  }

  get clientRepository(): IClientRepository {
    if (!this._clientRepository) {
      this._clientRepository = new ClientRepository();
    }
    return this._clientRepository;
  }

  get workerRepository(): IWorkerRepository {
    if (!this._workerRepository) {
      this._workerRepository = new WorkerRepository();
    }
    return this._workerRepository;
  }

  get adminRepository(): IAdminRepository {
    if (!this._adminRepository) {
      this._adminRepository = new AdminRepository();
    }
    return this._adminRepository
  }

  get otpRepository(): IOtpRepository {
    if (!this._otpRepository) {
      this._otpRepository = new OtpRepository();
    }
    return this._otpRepository;
  }

  get categoryRepository(): ICategoryRepository {
    if (!this._categoryRepository) {
      this._categoryRepository = new CategoryRepository()
    }
    return this._categoryRepository;
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

  get otpService(): IOtpService {
    if (!this._otpService) {
      this._otpService = new OtpService();
    }
    return this._otpService;
  }

  get emailService(): IEmailService {
    if (!this._emailService) {
      this._emailService = new NodemailerEmailService();
    }
    return this._emailService;
  }

  get serviceRequestRepository(): IServiceRequestRepository {
    if (!this._serviceRequestRepository) {
      this._serviceRequestRepository = new ServiceRequestRepository();
    }
    return this._serviceRequestRepository;
  }

  get serviceRequestIdGenerator(): IGenerateServiceRequestId {
    if (!this._serviceRequestIdGenerator) {
      this._serviceRequestIdGenerator = new ServiceRequestIdGenerator();
    }
    return this._serviceRequestIdGenerator;
  }

  get s3Service(): S3Service {
    if (!this._s3Service) {
      this._s3Service = new S3Service();
    }
    return this._s3Service;
  }
}
