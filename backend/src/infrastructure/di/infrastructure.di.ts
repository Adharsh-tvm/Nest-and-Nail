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
import { S3Service } from "../adapters/S3service";
import { env } from "../../config/env";
import { IWorkerScheduleRepository } from "../../domain/repositories/IWorkerScheduleRepository";
import { WorkerScheduleRepository } from "../repo/WorkerScheduleRepository";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { ServiceRepository } from "../repo/ServiceRepository";
import { IPaymentRepository } from "../../domain/repositories/IPaymentRepository";
import { PaymentRepository } from "../repo/PaymentRepository";
import { IPaymentGateway } from "../../domain/gateways/IPaymentGateway";
import { RazorpayGateway } from "../adapters/RazorpayGateway";
import { PaymentModel } from "../database/models/PaymentModel";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import { WalletRepository } from "../repo/WalletRepository";

export class InfrastructureDI {
  private _userRepositoryFactory?: IUserRepositoryFactory;
  private _clientRepository?: IClientRepository;
  private _workerRepository?: IWorkerRepository;
  private _otpRepository?: IOtpRepository;
  private _adminRepository?: IAdminRepository;
  private _userRepository?: IBaseRepository<any>;
  private _workerScheduleRepo?: IWorkerScheduleRepository;
  private _serviceRepository?: IServiceRepository;
  private _paymentRepository?: IPaymentRepository;
  private _walletRepository?: IWalletRepository;

  private _paymentGateway?: IPaymentGateway;

  private _passwordHasher?: IPasswordHasher;
  private _idGenerator?: IGenerateUserID;
  private _tokenService?: ITokenService;
  private _logger?: ILogger;

  private _otpService?: IOtpService;
  private _emailService?: IEmailService;

  private _categoryRepository?: ICategoryRepository;

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

  get workerScheduleRepo(): IWorkerScheduleRepository {
    if (!this._workerScheduleRepo) {
      this._workerScheduleRepo = new WorkerScheduleRepository();
    }
    return this._workerScheduleRepo
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
      this._categoryRepository = new CategoryRepository();
    }
    return this._categoryRepository;
  }

  get serviceRepository(): IServiceRepository {
    if (!this._serviceRepository) {
      this._serviceRepository = new ServiceRepository();
    }
    return this._serviceRepository;
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
        env.ACCESS_TOKEN_SECRET,
        env.REFRESH_TOKEN_SECRET
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

  get s3Service(): S3Service {
    if (!this._s3Service) {
      this._s3Service = new S3Service();
    }
    return this._s3Service;
  }

  get paymentRepository(): IPaymentRepository {
    if (!this._paymentRepository) {
      this._paymentRepository = new PaymentRepository(PaymentModel)
    }
    return this._paymentRepository;
  }

  get paymentGateway(): IPaymentGateway {
    if (!this._paymentGateway) {
      this._paymentGateway = new RazorpayGateway();
    }
    return this._paymentGateway
  }

  get walletRepository(): IWalletRepository {
    if (!this._walletRepository) {
      this._walletRepository = new WalletRepository();
    }
    return this._walletRepository;
  }
}
