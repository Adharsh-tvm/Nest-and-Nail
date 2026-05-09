import { ILogger } from "../logger/ILogger";
import { IEmailService } from "../../application/contracts/IEmailService";
import { User } from "../../domain/entities/User";
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
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { TransactionRepository } from "../repo/TransactionRepository";
import { IConcernRepository } from "../../domain/repositories/IConcernRepository";
import { ConcernRepository } from "../repo/ConcernRepository";
import { IReviewRepository } from "../../domain/repositories/IReviewRepository";
import { ReviewRepository } from "../repo/ReviewRepository";
import { IRealtimeService } from "../../application/interfaces/socket/IRealtimeService";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { NotificationRepository } from "../repo/NotificationRepository";
import { IChatRepository } from "../../domain/repositories/IChatRepository";
import { ChatRepository } from "../repo/ChatRepository";

export class InfrastructureDI {
  private _userRepositoryFactory?: IUserRepositoryFactory;
  private _clientRepository?: IClientRepository;
  private _workerRepository?: IWorkerRepository;
  private _otpRepository?: IOtpRepository;
  private _adminRepository?: IAdminRepository;
  private _userRepository?: IBaseRepository<User>;
  private _workerScheduleRepo?: IWorkerScheduleRepository;
  private _serviceRepository?: IServiceRepository;
  private _paymentRepository?: IPaymentRepository;
  private _walletRepository?: IWalletRepository;
  private _transactionRepository?: ITransactionRepository;
  private _concernRepository?: IConcernRepository;
  private _reviewRepository?: IReviewRepository;

  private _paymentGateway?: IPaymentGateway;

  private _passwordHasher?: IPasswordHasher;
  private _idGenerator?: IGenerateUserID;
  private _tokenService?: ITokenService;
  private _logger?: ILogger;

  private _otpService?: IOtpService;
  private _emailService?: IEmailService;

  private _categoryRepository?: ICategoryRepository;

  private _s3Service?: S3Service;

  private _realtimeService?: IRealtimeService;
  private _notificationRepository?: INotificationRepository;
  private _chatRepository?: IChatRepository;


  get userRepositoryFactory(): IUserRepositoryFactory {
    return (this._userRepositoryFactory ??= new UserRepositoryFactory(
        this.clientRepository,
        this.workerRepository,
        this.adminRepository,
        this.userRepository
      ));
  }

  get userRepository(): IBaseRepository<User> {
    return (this._userRepository ??= new UserRepository());
  }

  get clientRepository(): IClientRepository {
    return (this._clientRepository ??= new ClientRepository());
  }

  get workerRepository(): IWorkerRepository {
    return (this._workerRepository ??= new WorkerRepository());
  }

  get workerScheduleRepo(): IWorkerScheduleRepository {
    return (this._workerScheduleRepo ??= new WorkerScheduleRepository());
  }

  get adminRepository(): IAdminRepository {
    return (this._adminRepository ??= new AdminRepository());
  }

  get otpRepository(): IOtpRepository {
    return (this._otpRepository ??= new OtpRepository());
  }

  get categoryRepository(): ICategoryRepository {
    return (this._categoryRepository ??= new CategoryRepository());
  }

  get serviceRepository(): IServiceRepository {
    return (this._serviceRepository ??= new ServiceRepository());
  }

  get passwordHasher(): IPasswordHasher {
    return (this._passwordHasher ??= new BcryptPasswordHasher());
  }

  get idGenerator(): IGenerateUserID {
    return (this._idGenerator ??= new UUIDGenerator());
  }

  get tokenService(): ITokenService {
    return (this._tokenService ??= new JwtTokenService(
        env.ACCESS_TOKEN_SECRET,
        env.REFRESH_TOKEN_SECRET
      ));
  }

  get logger(): ILogger {
    this._logger ??= loggerInstance;
    return this._logger;
  }

  get otpService(): IOtpService {
    return (this._otpService ??= new OtpService());
  }

  get emailService(): IEmailService {
    return (this._emailService ??= new NodemailerEmailService());
  }

  get s3Service(): S3Service {
    return (this._s3Service ??= new S3Service());
  }

  get paymentRepository(): IPaymentRepository {
    return (this._paymentRepository ??= new PaymentRepository(PaymentModel));
  }

  get paymentGateway(): IPaymentGateway {
    return (this._paymentGateway ??= new RazorpayGateway());
  }

  get walletRepository(): IWalletRepository {
    return (this._walletRepository ??= new WalletRepository());
  }

  get transactionRepository(): ITransactionRepository {
    return (this._transactionRepository ??= new TransactionRepository());
  }

  get concernRepository(): IConcernRepository {
    return (this._concernRepository ??= new ConcernRepository());
  }

  get reviewRepository(): IReviewRepository {
    return (this._reviewRepository ??= new ReviewRepository());
  }

  setRealtimeService(service: IRealtimeService) {
    this._realtimeService = service;
  }

  get realtimeService(): IRealtimeService {
    if (!this._realtimeService) {
      throw new Error("RealtimeService not initialized");
    }
    return this._realtimeService;
  }

  get notificationRepository(): INotificationRepository {
    return (this._notificationRepository ??= new NotificationRepository());
  }

  get chatRepository(): IChatRepository {
    return (this._chatRepository ??= new ChatRepository());
  }
}
