import { IChangeUserRoleUseCase } from "../../application/interfaces/IChangeUserRoleUseCase";
import { ICreateCategoryUseCase } from "../../application/interfaces/ICreateCategoryUseCase";
import { IForgotPasswordUseCase } from "../../application/interfaces/IForgotPasswordUseCase";
import { IGetAllCategoriesUseCase } from "../../application/interfaces/IGetAllCategoriesUseCase";
import { IGetAllClientsUseCase } from "../../application/interfaces/IGetAllClientsUseCase";
import { IGetAllUsersUseCase } from "../../application/interfaces/IGetAllUsersUseCase";
import { IGetAllWorkersUseCase } from "../../application/interfaces/IGetAllWorkersUseCase";
import { IGetCurrentUserUseCase } from "../../application/interfaces/IGetCurrentUserUseCase";
import { IGoogleSignUpUseCase } from "../../application/interfaces/IGoogleSignUpUseCase";
import { ILoginUserUseCase } from "../../application/interfaces/ILoginUserUseCase";
import { IRefreshTokenUseCase } from "../../application/interfaces/IRefreshTokenUseCase";
import { IRegisterUserUseCase } from "../../application/interfaces/IRegisterUserUseCase";
import { IResetPasswordUseCase } from "../../application/interfaces/IResetPasswordUseCase";
import { ISendOtpUseCase } from "../../application/interfaces/ISendOtpUseCase";
import { IUpdateCategoryStatusUseCase } from "../../application/interfaces/IUpdateCategoryStatusUseCase";
import { IUpdateCategoryUseCase } from "../../application/interfaces/IUpdateCategoryUseCase";
import { IUpdateUserAccessUseCase } from "../../application/interfaces/IUpdateUserAccessUseCase";
import { IUpdateUserAddressUseCase } from "../../application/interfaces/IUpdateUserAddressUseCase";
import { IUpdateUserProfileUseCase } from "../../application/interfaces/IUpdateUserProfileUseCase";
import { IUpdateUserSkillsUseCase } from "../../application/interfaces/IUpdateUserSkillsUseCase";
import { IUpdateVerificationStatusUseCase } from "../../application/interfaces/IUpdateVerificationStatusUseCase";
import { IUploadProfilePictureUseCase } from "../../application/interfaces/IUploadProfilePictureUseCase";
import { IUploadWorkerDocumentUseCase } from "../../application/interfaces/IUploadWorkerDocumentUseCase";
import { IVerifyOtpUseCase } from "../../application/interfaces/IVerifyOtpUseCase";
import { GetAllClientsUseCase } from "../../application/use-cases/admin/GetAllClientsUseCase";
import { GetAllUsersUseCase } from "../../application/use-cases/admin/GetAllUsersUseCase";
import { GetAllWorkersUseCase } from "../../application/use-cases/admin/GetAllWorkersUseCase";
import { UpdateUserAccessUseCase } from "../../application/use-cases/admin/UpdateUserAccessUseCase";
import { UpdateVerificationStatusUseCase } from "../../application/use-cases/admin/UpdateVerificationStatusUseCase";
import { UploadProfilePictureUseCase } from "../../application/use-cases/admin/UploadProfilePictureUseCase";
import { ForgotPasswordUseCase } from "../../application/use-cases/auth/ForgotPasswordUseCase";
import { GoogleSignUpUseCase } from "../../application/use-cases/auth/GoogleSignUpUseCase";
import { LoginUserUseCase } from "../../application/use-cases/auth/LoginUserUseCase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/RefreshTokenUseCase";
import { RegisterUserUseCase } from "../../application/use-cases/auth/RegisterUserUseCase";
import { ResetPasswordUseCase } from "../../application/use-cases/auth/ResetPasswordUseCase";
import { SendOtpUseCase } from "../../application/use-cases/auth/SendOtpUseCase";
import { VerifyOtpUseCase } from "../../application/use-cases/auth/VerifyOtpUseCase";
import { CreateCategoryUseCase } from "../../application/use-cases/category/CreateCategoryUseCase";
import { GetAllCategoriesUseCase } from "../../application/use-cases/category/GetAllCategoriesUseCase";
import { UpdateCategoryStatusUseCase } from "../../application/use-cases/category/UpdateCategoryStatusUseCase";
import { UpdateCategoryUseCase } from "../../application/use-cases/category/UpdateCategoryUseCase";
import { ChangeUserRoleUseCase } from "../../application/use-cases/user/ChangeUserRoleUseCase";
import { GetCurrentUserUseCase } from "../../application/use-cases/user/GetCurrentUserUseCase";
import { UpdateUserAddressUseCase } from "../../application/use-cases/user/UpdateUserAddressUseCase";
import { UpdateUserProfileUseCase } from "../../application/use-cases/user/UpdateUserProfileUseCase";
import { UpdateUserSkillsUseCase } from "../../application/use-cases/user/UpdateUserSkillsUseCase";
import { UploadWorkerDocumentUseCase } from "../../application/use-cases/user/UploadWorkerDocumentUseCase";
import { InfrastructureDI } from "./infrastructure.di";



export class UseCaseDI {

  private _registerUserUseCase?: IRegisterUserUseCase;
  private _loginUserUseCase?: ILoginUserUseCase;

  private _sendOtpUseCase?: ISendOtpUseCase;
  private _verifyOtpUseCase?: IVerifyOtpUseCase;

  private _googleLoginUseCase?: IGoogleSignUpUseCase;

  private _getAllClientsUseCase?: IGetAllClientsUseCase;
  private _getAllWorkersUseCase?: IGetAllWorkersUseCase;
  private _getAllUsersUseCase?: IGetAllUsersUseCase;
  private _getCurrentUserUseCase?: IGetCurrentUserUseCase;

  private _forgotpasswordUseCase?: IForgotPasswordUseCase;
  private _resetPasswordUseCase?: IResetPasswordUseCase;

  private _refreshTokenUseCase?: IRefreshTokenUseCase;

  private _changeUserRoleuseCase?: IChangeUserRoleUseCase;
  private _updateUserAccessUseCase?: IUpdateUserAccessUseCase;

  private _uploadProfilePictureUseCase?: IUploadProfilePictureUseCase;
  private _uploadWorkerDocumentUseCase?: IUploadWorkerDocumentUseCase;

  private _updateUserProfileUseCase?: IUpdateUserProfileUseCase;
  private _updateVerificationStatusUseCase?: IUpdateVerificationStatusUseCase;
  private _updateUserSkillUseCase?: IUpdateUserSkillsUseCase;
  private _updateUserAddressUseCase?: IUpdateUserAddressUseCase;

  private _createCategoryUseCase?: ICreateCategoryUseCase;
  private _getAllCategoriesUseCase?: IGetAllCategoriesUseCase;
  private _updateCategoryStatusUseCase?: IUpdateCategoryStatusUseCase;
  private _updateCategoryUseCase?: IUpdateCategoryUseCase;


  constructor(private infra: InfrastructureDI) { }


  get registerUserUseCase(): IRegisterUserUseCase {
    if (!this._registerUserUseCase) {
      this._registerUserUseCase = new RegisterUserUseCase(
        this.infra.userRepositoryFactory,
        this.infra.passwordHasher,
        this.infra.idGenerator,
        this.infra.tokenService,
        this.infra.logger
      );
    }
    return this._registerUserUseCase;
  }

  get loginUserUseCase(): ILoginUserUseCase {
    if (!this._loginUserUseCase) {
      this._loginUserUseCase = new LoginUserUseCase(
        this.infra.userRepositoryFactory,
        this.infra.passwordHasher,
        this.infra.tokenService,
        this.infra.logger
      );
    }
    return this._loginUserUseCase;
  }

  get getAllClientsUseCase(): IGetAllClientsUseCase {
    if (!this._getAllClientsUseCase) {
      this._getAllClientsUseCase = new GetAllClientsUseCase(this.infra.clientRepository);
    }
    return this._getAllClientsUseCase;
  }

  get getAllWorkersUseCase(): IGetAllWorkersUseCase {
    if (!this._getAllWorkersUseCase) {
      this._getAllWorkersUseCase = new GetAllWorkersUseCase(this.infra.workerRepository);
    }
    return this._getAllWorkersUseCase;
  }

  get googleLoginUseCase(): IGoogleSignUpUseCase {
    if (!this._googleLoginUseCase) {
      this._googleLoginUseCase = new GoogleSignUpUseCase(
        this.infra.userRepositoryFactory,
        this.infra.passwordHasher,
        this.infra.tokenService,
        this.infra.idGenerator
      );
    }
    return this._googleLoginUseCase;
  }

  get sendOtpUseCase(): ISendOtpUseCase {
    if (!this._sendOtpUseCase) {
      this._sendOtpUseCase = new SendOtpUseCase(
        this.infra.emailService,
        this.infra.otpService,
        this.infra.otpRepository,
        this.infra.userRepositoryFactory,
        this.infra.logger
      );
    }
    return this._sendOtpUseCase;
  }

  get verifyOtpUseCase(): IVerifyOtpUseCase {
    if (!this._verifyOtpUseCase) {
      this._verifyOtpUseCase = new VerifyOtpUseCase(
        this.infra.otpService,
        this.infra.otpRepository,
        this.infra.logger);
    }
    return this._verifyOtpUseCase;
  }


  get refreshTokenUseCase(): IRefreshTokenUseCase {
    if (!this._refreshTokenUseCase) {
      this._refreshTokenUseCase = new RefreshTokenUseCase(
        this.infra.tokenService);
    }
    return this._refreshTokenUseCase
  }

  get forgotPasswordUseCase(): IForgotPasswordUseCase {
    if (!this._forgotpasswordUseCase) {
      this._forgotpasswordUseCase = new ForgotPasswordUseCase(
        this.infra.emailService,
        this.infra.otpService,
        this.infra.otpRepository,
        this.infra.userRepositoryFactory);
    }
    return this._forgotpasswordUseCase;
  }

  get resetPasswordUseCase(): IResetPasswordUseCase {
    if (!this._resetPasswordUseCase) {
      this._resetPasswordUseCase = new ResetPasswordUseCase(
        this.infra.userRepositoryFactory,
        this.infra.passwordHasher,
        this.infra.otpRepository,
        this.infra.logger);
    }
    return this._resetPasswordUseCase;
  }

  get changeUserRoleUseCase(): IChangeUserRoleUseCase {
    if (!this._changeUserRoleuseCase) {
      this._changeUserRoleuseCase = new ChangeUserRoleUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger,
        this.infra.tokenService
      )
    }
    return this._changeUserRoleuseCase
  }

  get getCurrentUserUseCase(): IGetCurrentUserUseCase {
    if (!this._getCurrentUserUseCase) {
      this._getCurrentUserUseCase = new GetCurrentUserUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger
      );
    }
    return this._getCurrentUserUseCase;
  }

  get uploadProfilePictureUseCase(): IUploadProfilePictureUseCase {
    if (!this._uploadProfilePictureUseCase) {
      this._uploadProfilePictureUseCase = new UploadProfilePictureUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger
      );
    }
    return this._uploadProfilePictureUseCase;
  }

  get uploadWorkerDocumentUseCase(): IUploadWorkerDocumentUseCase {
    if (!this._uploadWorkerDocumentUseCase) {
      this._uploadWorkerDocumentUseCase = new UploadWorkerDocumentUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger
      );
    }
    return this._uploadWorkerDocumentUseCase;
  }

  get updateUserProfileUseCase(): IUpdateUserProfileUseCase {
    if (!this._updateUserProfileUseCase) {
      this._updateUserProfileUseCase = new UpdateUserProfileUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger,
        this.uploadProfilePictureUseCase
      );
    }
    return this._updateUserProfileUseCase
  }

  get getAllUsersUseCase(): IGetAllUsersUseCase {
    if (!this._getAllUsersUseCase) {
      this._getAllUsersUseCase = new GetAllUsersUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger
      )
    }
    return this._getAllUsersUseCase;
  }

  get updateVerificationStatusUseCase(): IUpdateVerificationStatusUseCase {
    if (!this._updateVerificationStatusUseCase) {
      this._updateVerificationStatusUseCase = new UpdateVerificationStatusUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger
      );
    }
    return this._updateVerificationStatusUseCase;
  }

  get updateUserAccessUseCase(): IUpdateUserAccessUseCase {
    if (!this._updateUserAccessUseCase) {
      this._updateUserAccessUseCase = new UpdateUserAccessUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger
      );
    }
    return this._updateUserAccessUseCase
  }

  get updateUserSkillsUseCase(): IUpdateUserSkillsUseCase {
    if (!this._updateUserSkillUseCase) {
      this._updateUserSkillUseCase = new UpdateUserSkillsUseCase(
        this.infra.userRepositoryFactory
      );
    }
    return this._updateUserSkillUseCase;
  }

  get updateUserAddressUseCase(): IUpdateUserAddressUseCase {
    if (!this._updateUserAddressUseCase) {
      this._updateUserAddressUseCase = new UpdateUserAddressUseCase(
        this.infra.userRepositoryFactory
      )
    }
    return this._updateUserAddressUseCase;
  }

  get createCategoryUseCase(): ICreateCategoryUseCase {
    if (!this._createCategoryUseCase) {
      this._createCategoryUseCase = new CreateCategoryUseCase(
        this.infra.categoryRepository
      )
    }
    return this._createCategoryUseCase
  }

  get getAllCategoriesUseCase(): IGetAllCategoriesUseCase {
    if (!this._getAllCategoriesUseCase) {
      this._getAllCategoriesUseCase = new GetAllCategoriesUseCase(
        this.infra.categoryRepository
      )
    }
    return this._getAllCategoriesUseCase
  }
  
  get updateCategoryUseCase(): IUpdateCategoryUseCase {
    if(!this._updateCategoryUseCase) {
      this._updateCategoryUseCase = new UpdateCategoryUseCase(
        this.infra.categoryRepository
      )
    }
    return this._updateCategoryUseCase
  }

  get updateCategoryStatusUseCase(): IUpdateCategoryStatusUseCase {
    if (!this._updateCategoryStatusUseCase) {
      this._updateCategoryStatusUseCase = new UpdateCategoryStatusUseCase(
        this.infra.categoryRepository
      )
    }
    return this._updateCategoryStatusUseCase
  }

}