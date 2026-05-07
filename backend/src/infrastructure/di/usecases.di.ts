import { InfrastructureDI } from "./infrastructure.di";
import { IChangeUserRoleUseCase } from "../../application/interfaces/user/IChangeUserRoleUseCase";
import { ICreateCategoryUseCase } from "../../application/interfaces/category/ICreateCategoryUseCase";
import { IForgotPasswordUseCase } from "../../application/interfaces/auth/IForgotPasswordUseCase";
import { IGetAllCategoriesUseCase } from "../../application/interfaces/category/IGetAllCategoriesUseCase";
import { IGetAllClientsUseCase } from "../../application/interfaces/admin/IGetAllClientsUseCase";
import { IGetAllUsersUseCase } from "../../application/interfaces/admin/IGetAllUsersUseCase";
import { IGetAllWorkersUseCase } from "../../application/interfaces/admin/IGetAllWorkersUseCase";
import { IGetCurrentUserUseCase } from "../../application/interfaces/user/IGetCurrentUserUseCase";
import { IGoogleSignUpUseCase } from "../../application/interfaces/auth/IGoogleSignUpUseCase";
import { ILoginUserUseCase } from "../../application/interfaces/auth/ILoginUserUseCase";
import { IRefreshTokenUseCase } from "../../application/interfaces/auth/IRefreshTokenUseCase";
import { IRegisterUserUseCase } from "../../application/interfaces/auth/IRegisterUserUseCase";
import { IResetPasswordUseCase } from "../../application/interfaces/auth/IResetPasswordUseCase";
import { ISendOtpUseCase } from "../../application/interfaces/auth/ISendOtpUseCase";
import { IUpdateCategoryStatusUseCase } from "../../application/interfaces/category/IUpdateCategoryStatusUseCase";
import { IUpdateCategoryUseCase } from "../../application/interfaces/category/IUpdateCategoryUseCase";
import { IUpdateUserAccessUseCase } from "../../application/interfaces/admin/IUpdateUserAccessUseCase";
import { IUpdateUserProfileUseCase } from "../../application/interfaces/user/IUpdateUserProfileUseCase";
import { IUpdateUserSkillsUseCase } from "../../application/interfaces/user/IUpdateUserSkillsUseCase";
import { IUpdateVerificationStatusUseCase } from "../../application/interfaces/admin/IUpdateVerificationStatusUseCase";
import { IUpdateWorkerCategoriesUseCase } from "../../application/interfaces/worker/profile/IUpdateWorkerCategoriesUseCase";

import { IUploadProfilePictureUseCase } from "../../application/interfaces/user/IUploadProfilePictureUseCase";
import { IUploadWorkerDocumentUseCase } from "../../application/interfaces/user/IUploadWorkerDocumentUseCase";
import { IValidateUserUseCase } from "../../application/interfaces/auth/IValidateUserUseCase";
import { ValidateUserUseCase } from "../../application/use-cases/auth/ValidateUserUseCase";
import { IVerifyOtpUseCase } from "../../application/interfaces/auth/IVerifyOtpUseCase";
import { GetAllClientsUseCase } from "../../application/use-cases/admin/GetAllClientsUseCase";
import { GetAllUsersUseCase } from "../../application/use-cases/admin/GetAllUsersUseCase";
import { GetAllWorkersUseCase } from "../../application/use-cases/admin/GetAllWorkersUseCase";
import { GetAdminDashboardDataUseCase } from "../../application/use-cases/admin/GetAdminDashboardDataUseCase";
import { IGetAdminDashboardDataUseCase } from "../../application/interfaces/admin/IGetAdminDashboardDataUseCase";
import { UpdateUserAccessUseCase } from "../../application/use-cases/admin/UpdateUserAccessUseCase";
import { UpdateVerificationStatusUseCase } from "../../application/use-cases/admin/UpdateVerificationStatusUseCase";
import { UploadProfilePictureUseCase } from "../../application/use-cases/user/UploadProfilePictureUseCase";
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
import { UpdateUserProfileUseCase } from "../../application/use-cases/user/UpdateUserProfileUseCase";
import { UpdateUserSkillsUseCase } from "../../application/use-cases/user/UpdateUserSkillsUseCase";
import { UpdateWorkerCategoriesUseCase } from "../../application/use-cases/worker/profile/UpdateWorkerCategoriesUseCase";

import { UploadWorkerDocumentUseCase } from "../../application/use-cases/user/UploadWorkerDocumentUseCase";

import { IAddUserAddressUseCase } from "../../application/interfaces/address/IUpdateUserAddressUseCase";
import { IEditUserAddressUseCase } from "../../application/interfaces/address/IEditUserAddressUseCase";
import { IDeleteUserAddressUseCase } from "../../application/interfaces/address/IDeleteUserAddressUseCase";
import { AddUserAddressUseCase } from "../../application/use-cases/address/AddUserAddressUseCase";
import { EditUserAddressUseCase } from "../../application/use-cases/address/EditUserAddressUseCase";
import { DeleteUserAddressUseCase } from "../../application/use-cases/address/DeleteUserAddressUseCase";
import { IGetS3UploadUrlUseCase } from "../../application/interfaces/media/IGetS3UploadUrlUseCase";
import { GetS3UploadUrlUseCase } from "../../application/use-cases/media/GetS3UploadUrlUseCase";
import { IGetAvailableWorkersUseCase } from "../../application/interfaces/client/IGetAvailableWorkersUseCase";
import { GetAvailableWorkersUseCase } from "../../application/use-cases/client/GetAvailableWorkersUseCase";
import { IGetWorkerByIdUseCase } from "../../application/interfaces/client/IGetWorkerByIdUseCase";
import { GetWorkerByIdUseCase } from "../../application/use-cases/client/GetWorkerByIdUseCase";
import { IGetWorkerAvailabilityUseCase } from "../../application/interfaces/client/IGetWorkerAvailabilityUseCase";
import { GetWorkerAvailabilityUseCase } from "../../application/use-cases/client/GetWorkerAvailabilityUseCase";
import { IBookWorkerUseCase } from "../../domain/repositories/IBookWorkerUseCase";
import { BookWorkerUseCase } from "../../application/use-cases/client/BookWorkerUseCase";
import { IGetClientServiceHistoryUseCase } from "../../application/interfaces/service/client/IGetClientServiceHistoryUseCase";
import { GetClientServiceHistoryUseCase } from "../../application/use-cases/service/client/GetClientServiceHistoryUseCase";
import { IGetClientServiceByIdUseCase } from "../../application/interfaces/service/client/IGetClientServiceByIdUseCase";
import { IGetClientOngoingServicesUseCase } from "../../application/interfaces/service/client/IGetClientOngoingServicesUseCase";
import { GetClientServiceByIdUseCase } from "../../application/use-cases/service/client/GetClientServiceByIdUseCase";
import { GetClientOngoingServicesUseCase } from "../../application/use-cases/service/client/GetClientOngoingServicesUseCase";
import { IGetWorkerServicesUseCase } from "../../application/interfaces/service/worker/IGetWorkerServicesUseCase";
import { IGetWorkerServiceDetailsUseCase } from "../../application/interfaces/service/worker/IGetWorkerServiceDetailsUseCase";
import { GetWorkerServiceDetailsUseCase } from "../../application/use-cases/service/worker/GetWorkerServiceDetailsUseCase";
import { GetWorkerServicesUseCase } from "../../application/use-cases/service/worker/GetWorkerServicesUseCase";
import { IGetActiveWorkerServiceUseCase } from "../../application/interfaces/service/worker/IGetActiveWorkerServiceUseCase";
import { GetActiveWorkerServiceUseCase } from "../../application/use-cases/service/worker/GetActiveWorkerServiceUseCase";
import { IGetAllServicesUseCase } from "../../application/interfaces/service/admin/IGetAllServicesUseCase";
import { IGetServiceDetailsForAdminUseCase } from "../../application/interfaces/service/admin/IGetServiceDetailsForAdminUseCase";
import { GetServiceDetailsForAdminUseCase } from "../../application/use-cases/service/admin/GetServiceDetailsForAdminUseCase";
import { GetAllServicesUseCase } from "../../application/use-cases/service/admin/GetAllServicesUseCase";
import { IStartServiceUseCase } from "../../application/interfaces/service/IStartServiceUseCase";
import { StartServiceUseCase } from "../../application/use-cases/service/StartServiceUseCase";
import { ICompleteServiceUseCase } from "../../application/interfaces/service/ICompleteServiceUseCase";
import { CompleteServiceUseCase } from "../../application/use-cases/service/CompleteServiceUseCase";
import { IChangePasswordUseCase } from "../../application/interfaces/auth/IChangePasswordUseCase";
import { ChangePasswordUseCase } from "../../application/use-cases/auth/ChangePasswordUseCase";
import { IBlockWorkerDatesUseCase } from "../../application/interfaces/worker/profile/IBlockWorkerDatesUseCase";
import { BlockWorkerDatesUseCase } from "../../application/use-cases/worker/profile/BlockWorkerDatesUseCase";
import { IGetWorkerBlockedDatesUseCase } from "../../application/interfaces/worker/profile/IGetWorkerBlockedDatesUseCase";
import { GetWorkerBlockedDatesUseCase } from "../../application/use-cases/worker/profile/GetWorkerBlockedDatesUseCase";
import { IGetWorkerDashboardDataUseCase } from "../../application/interfaces/worker/profile/IGetWorkerDashboardDataUseCase";
import { GetWorkerDashboardDataUseCase } from "../../application/use-cases/worker/profile/GetWorkerDashboardDataUseCase";
import { IGetClientScheduledMeetingsUseCase } from "../../application/interfaces/meetings/client/IGetClientScheduledVideoCallsUseCase";
import { IGetClientMeetingsHistoryUseCase } from "../../application/interfaces/meetings/client/IGetClientVideoCallHistoryUseCase";
import { IGetWorkerScheduledMeetingsUseCase } from "../../application/interfaces/meetings/worker/IGetWorkerScheduledMeetingsUseCase";
import { IGetWorkerMeetingsHistoryUseCase } from "../../application/interfaces/meetings/worker/IGetWorkerMeetingsUseCase";
import { GetClientScheduledMeetingsUseCase } from "../../application/use-cases/meetings/client/GetClientScheduledMeetingsUseCase";
import { GetClientMeetingsHistoryUseCase } from "../../application/use-cases/meetings/client/GetClientMeetingsHistoryUseCase";
import { GetWorkerScheduledMeetingsUseCase } from "../../application/use-cases/meetings/worker/GetWorkerScheduledMeetingsUseCase";
import { GetWorkerMeetingsHistoryUseCase } from "../../application/use-cases/meetings/worker/GetWorkerMeetingsHistoryUseCase";
import { IGetClientMeetingByIdUseCase } from "../../application/interfaces/meetings/client/IGetClientMeetingByIdUseCase";
import { IGetWorkerMeetingByIdUseCase } from "../../application/interfaces/meetings/worker/IGetWorkerMeetingByIdUseCase";
import { GetClientMeetingByIdUseCase } from "../../application/use-cases/meetings/client/GetClientMeetingByIdUseCase";
import { GetWorkerMeetingByIdUseCase } from "../../application/use-cases/meetings/worker/GetWorkerMeetingByIdUseCase";
import { IJoinVideoCallUseCase } from "../../application/interfaces/meetings/IJoinVideoCallUseCase";
import { IEndVideoCallUseCase } from "../../application/interfaces/meetings/IEndVideoCallUseCase";
import { ILeaveVideoCallUseCase } from "../../application/interfaces/meetings/ILeaveVideoCallUseCase";
import { JoinVideoCallUseCase } from "../../application/use-cases/meetings/JoinVideoCallUseCase";
import { EndVideoCallUseCase } from "../../application/use-cases/meetings/EndVideoCallUseCase";
import { LeaveVideoCallUseCase } from "../../application/use-cases/meetings/LeaveVideoCallUseCase";
import { ICreatePaymentUseCase } from "../../application/interfaces/payment/ICreatePaymentUseCase";
import { IVerifyPaymentUseCase } from "../../application/interfaces/payment/IVerifyPaymentUseCase";
import { CreatePaymentUseCase } from "../../application/use-cases/payment/CreatePaymentUseCase";
import { VerifyPaymentUseCase } from "../../application/use-cases/payment/VerifyPaymentUseCase";
import { ProcessWalletPaymentUseCase } from "../../application/use-cases/payment/ProcessWalletPaymentUseCase";
import { GetWalletBalanceUseCase } from "../../application/use-cases/payment/GetWalletBalanceUseCase";
import { IGetWalletBalanceUseCase } from "../../application/interfaces/payment/IGetWalletBalanceUseCase";
import { IGetMeetingByIdForAdminUseCase } from "../../application/interfaces/meetings/admin/IGetMeetingByIdForAdminUseCase";
import { GetMeetingByIdForAdminUseCase } from "../../application/use-cases/meetings/admin/GetMeetingByIdForAdminUseCase";
import { IGetAllMeetingsForAdminUseCase } from "../../application/interfaces/meetings/admin/IGetAllMeetingsForAdminUseCase";
import { GetAllMeetingsForAdminUseCase } from "../../application/use-cases/meetings/admin/GetAllMeetingsForAdminUseCase";
import { ICancelServiceUseCase } from "../../application/interfaces/service/ICancelServiceUseCase";
import { CancelServiceUseCase } from "../../application/use-cases/service/CancelServiceUseCase";
import { IGetTransactionsUseCase } from "../../application/interfaces/payment/IGetTransactionsUseCase";
import { IGetClientTransactionsUseCase } from "../../application/interfaces/payment/IGetClientTransactionsUseCase";
import { IGetWorkerTransactionsUseCase } from "../../application/interfaces/payment/IGetWorkerTransactionsUseCase";
import { IGetAllTransactionsUseCase } from "../../application/interfaces/payment/IGetAllTransactionsUseCase";
import { GetTransactionsUseCase } from "../../application/use-cases/payment/GetTransactionsUseCase";
import { GetClientTransactionsUseCase } from "../../application/use-cases/payment/GetClientTransactionsUseCase";
import { GetWorkerTransactionsUseCase } from "../../application/use-cases/payment/GetWorkerTransactionsUseCase";
import { GetAllTransactionsUseCase } from "../../application/use-cases/payment/GetAllTransactionsUseCase";
import { CreateRechargeOrderUseCase } from "../../application/use-cases/payment/CreateRechargeOrderUseCase";
import { VerifyRechargePaymentUseCase, IVerifyRechargePaymentUseCase } from "../../application/use-cases/payment/VerifyRechargePaymentUseCase";
import { ICreateRechargeOrderUseCase } from "../../application/interfaces/payment/ICreateRechargeOrderUseCase";
import { ICreateConcernUseCase } from "../../application/interfaces/concern/ICreateConcernUseCase";
import { IGetUserConcernsUseCase } from "../../application/interfaces/concern/IGetUserConcernsUseCase";
import { IGetAllConcernsUseCase } from "../../application/interfaces/concern/IGetAllConcernsUseCase";
import { CreateConcernUseCase } from "../../application/use-cases/concern/CreateConcernUseCase";
import { GetUserConcernsUseCase } from "../../application/use-cases/concern/GetUserConcernsUseCase";
import { GetAllConcernsUseCase } from "../../application/use-cases/concern/GetAllConcernsUseCase";
import { IAddReviewUseCase } from "../../application/interfaces/review/IAddReviewUseCase";
import { AddReviewUseCase } from "../../application/use-cases/review/AddReviewUseCase";
import { ISendNotificationUseCase } from "../../application/interfaces/notifications/ISendNotificationUseCase";
import { SendNotificationUseCase } from "../../application/use-cases/notification/SendNotificationUseCase";
import { ISendMessageUseCase } from "../../application/interfaces/chat/ISendMessageUseCase";
import { IGetMessagesUseCase } from "../../application/interfaces/chat/IGetMessagesUseCase";
import { SendMessageUseCase } from "../../application/use-cases/chat/SendMessageUseCase";
import { GetMessagesUseCase } from "../../application/use-cases/chat/GetMessagesUseCase";

export class UseCaseDI {

  private _registerUserUseCase?: IRegisterUserUseCase;
  private _loginUserUseCase?: ILoginUserUseCase;

  private _sendOtpUseCase?: ISendOtpUseCase;
  private _verifyOtpUseCase?: IVerifyOtpUseCase;
  private _validateUserUseCase?: IValidateUserUseCase;

  private _googleLoginUseCase?: IGoogleSignUpUseCase;

  private _getAllClientsUseCase?: IGetAllClientsUseCase;
  private _getAllWorkersUseCase?: IGetAllWorkersUseCase;
  private _getAllUsersUseCase?: IGetAllUsersUseCase;
  private _getCurrentUserUseCase?: IGetCurrentUserUseCase;
  private _getAdminDashboardDataUseCase?: IGetAdminDashboardDataUseCase;

  private _forgotpasswordUseCase?: IForgotPasswordUseCase;
  private _resetPasswordUseCase?: IResetPasswordUseCase;
  private _changePasswordUseCase?: IChangePasswordUseCase;

  private _refreshTokenUseCase?: IRefreshTokenUseCase;

  private _changeUserRoleuseCase?: IChangeUserRoleUseCase;
  private _updateUserAccessUseCase?: IUpdateUserAccessUseCase;

  private _uploadProfilePictureUseCase?: IUploadProfilePictureUseCase;
  private _uploadWorkerDocumentUseCase?: IUploadWorkerDocumentUseCase;

  private _updateUserProfileUseCase?: IUpdateUserProfileUseCase;
  private _updateVerificationStatusUseCase?: IUpdateVerificationStatusUseCase;
  private _updateUserSkillUseCase?: IUpdateUserSkillsUseCase;
  private _createCategoryUseCase?: ICreateCategoryUseCase;
  private _getAllCategoriesUseCase?: IGetAllCategoriesUseCase;
  private _updateCategoryStatusUseCase?: IUpdateCategoryStatusUseCase;
  private _updateCategoryUseCase?: IUpdateCategoryUseCase;
  private _updateWorkerCategoriesUseCase?: IUpdateWorkerCategoriesUseCase;
  private _addUserAddressUseCase?: IAddUserAddressUseCase;
  private _editUserAddressUseCase?: IEditUserAddressUseCase;
  private _deleteUserAddressUseCase?: IDeleteUserAddressUseCase;

  private _getS3UploadUrlUseCase?: IGetS3UploadUrlUseCase;

  private _getAvailableWorkersUseCase?: IGetAvailableWorkersUseCase;
  private _getWorkerByIdUseCase?: IGetWorkerByIdUseCase;
  private _getWorkerAvailabilityUseCase?: IGetWorkerAvailabilityUseCase;

  private _bookWorkerUseCase?: IBookWorkerUseCase;
  private _cancelServiceUseCase?: ICancelServiceUseCase;
  private _getClientServiceHistoryUseCase?: IGetClientServiceHistoryUseCase;
  private _getClientServiceByIdUseCase?: IGetClientServiceByIdUseCase;
  private _getClientOngoingServicesUseCase?: IGetClientOngoingServicesUseCase;
  private _getWorkerServicesUseCase?: IGetWorkerServicesUseCase;
  private _getWorkerServiceDetailsUseCase?: IGetWorkerServiceDetailsUseCase;
  private _getActiveWorkerServiceUseCase?: IGetActiveWorkerServiceUseCase;
  private _getAllServicesUseCase?: IGetAllServicesUseCase;
  private _getServiceDetailsForAdminUseCase?: IGetServiceDetailsForAdminUseCase;
  private _startServiceUseCase?: IStartServiceUseCase;
  private _completeServiceUseCase?: ICompleteServiceUseCase;
  private _blockWorkerDatesUsecase?: IBlockWorkerDatesUseCase;
  private _getWorkerBlockedDatesUseCase?: IGetWorkerBlockedDatesUseCase;
  private _getWorkerDashboardDataUseCase?: IGetWorkerDashboardDataUseCase;
  private _getClientScheduledMeetingsUseCase?: IGetClientScheduledMeetingsUseCase;
  private _getClientMeetingsHistoryUseCase?: IGetClientMeetingsHistoryUseCase;
  private _getWorkerScheduledMeetingsUseCase?: IGetWorkerScheduledMeetingsUseCase;
  private _getWorkerMeetingsHistoryUseCase?: IGetWorkerMeetingsHistoryUseCase;
  private _getClientMeetingByIdUseCase?: IGetClientMeetingByIdUseCase;
  private _getWorkerMeetingByIdUseCase?: IGetWorkerMeetingByIdUseCase

  private _joinVideoCallUseCase?: IJoinVideoCallUseCase;
  private _endVideoCallUseCase?: IEndVideoCallUseCase;
  private _leaveVideoCallUseCase?: ILeaveVideoCallUseCase;

  private _createPaymentUseCase?: ICreatePaymentUseCase;
  private _verifyPaymentUseCase?: IVerifyPaymentUseCase;
  private _processWalletPaymentUseCase?: ProcessWalletPaymentUseCase;
  private _getWalletBalanceUseCase?: IGetWalletBalanceUseCase;
  private _getTransactionsUseCase?: IGetTransactionsUseCase;
  private _getClientTransactionsUseCase?: IGetClientTransactionsUseCase;
  private _getWorkerTransactionsUseCase?: IGetWorkerTransactionsUseCase;
  private _getAllTransactionsUseCase?: IGetAllTransactionsUseCase;
  private _createRechargeOrderUseCase?: ICreateRechargeOrderUseCase;
  private _verifyRechargePaymentUseCase?: IVerifyRechargePaymentUseCase;

  private _getMeetingByIdForAdminUseCase?: IGetMeetingByIdForAdminUseCase;
  private _getAllMeetingsForAdminUseCase?: IGetAllMeetingsForAdminUseCase;

  private _createConcernUseCase?: ICreateConcernUseCase;
  private _getUserConcernsUseCase?: IGetUserConcernsUseCase;
  private _getAllConcernsUseCase?: IGetAllConcernsUseCase;
  private _addReviewUseCase?: IAddReviewUseCase;

  private _sendNotificationUseCase?: ISendNotificationUseCase;
  private _sendMessageUseCase?: ISendMessageUseCase;
  private _getMessagesUseCase?: IGetMessagesUseCase;



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

  get getAdminDashboardDataUseCase(): IGetAdminDashboardDataUseCase {
    if (!this._getAdminDashboardDataUseCase) {
      this._getAdminDashboardDataUseCase = new GetAdminDashboardDataUseCase();
    }
    return this._getAdminDashboardDataUseCase;
  }

  get getWorkerDashboardDataUseCase(): IGetWorkerDashboardDataUseCase {
    if (!this._getWorkerDashboardDataUseCase) {
      this._getWorkerDashboardDataUseCase = new GetWorkerDashboardDataUseCase();
    }
    return this._getWorkerDashboardDataUseCase;
  }

  get getAllWorkersUseCase(): IGetAllWorkersUseCase {
    if (!this._getAllWorkersUseCase) {
      this._getAllWorkersUseCase = new GetAllWorkersUseCase(
        this.infra.workerRepository,
        this.infra.s3Service
      );
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

  get validateUserUseCase(): IValidateUserUseCase {
    if (!this._validateUserUseCase) {
      this._validateUserUseCase = new ValidateUserUseCase(
        this.infra.userRepositoryFactory
      );
    }
    return this._validateUserUseCase;
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

  get changePasswordUseCase(): IChangePasswordUseCase {
    if (!this._changePasswordUseCase) {
      this._changePasswordUseCase = new ChangePasswordUseCase(
        this.infra.userRepositoryFactory,
        this.infra.passwordHasher,
        this.infra.logger
      )
    }
    return this._changePasswordUseCase;
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
        this.infra.logger,
        this.infra.s3Service
      );
    }
    return this._getCurrentUserUseCase;
  }

  get uploadProfilePictureUseCase(): IUploadProfilePictureUseCase {
    if (!this._uploadProfilePictureUseCase) {
      this._uploadProfilePictureUseCase = new UploadProfilePictureUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger,
        this.infra.s3Service
      );
    }
    return this._uploadProfilePictureUseCase;
  }

  get uploadWorkerDocumentUseCase(): IUploadWorkerDocumentUseCase {
    if (!this._uploadWorkerDocumentUseCase) {
      this._uploadWorkerDocumentUseCase = new UploadWorkerDocumentUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger,
        this.infra.s3Service
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
        this.infra.logger,
        this.infra.s3Service
      )
    }
    return this._getAllUsersUseCase;
  }

  get updateVerificationStatusUseCase(): IUpdateVerificationStatusUseCase {
    if (!this._updateVerificationStatusUseCase) {
      this._updateVerificationStatusUseCase = new UpdateVerificationStatusUseCase(
        this.infra.userRepositoryFactory,
        this.infra.emailService,
        this.infra.logger,
        this.sendNotificationUseCase
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

  get addUserAddressUseCase(): IAddUserAddressUseCase {
    if (!this._addUserAddressUseCase) {
      this._addUserAddressUseCase = new AddUserAddressUseCase(
        this.infra.userRepositoryFactory
      )
    }
    return this._addUserAddressUseCase;
  }

  get editUserAddressUseCase(): IEditUserAddressUseCase {
    if (!this._editUserAddressUseCase) {
      this._editUserAddressUseCase = new EditUserAddressUseCase(
        this.infra.userRepositoryFactory
      )
    }
    return this._editUserAddressUseCase;
  }

  get deleteUserAddressUseCase(): IDeleteUserAddressUseCase {
    if (!this._deleteUserAddressUseCase) {
      this._deleteUserAddressUseCase = new DeleteUserAddressUseCase(
        this.infra.userRepositoryFactory
      )
    }
    return this._deleteUserAddressUseCase;
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
    if (!this._updateCategoryUseCase) {
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

  get updateWorkerCategoriesUseCase(): IUpdateWorkerCategoriesUseCase {
    if (!this._updateWorkerCategoriesUseCase) {
      this._updateWorkerCategoriesUseCase = new UpdateWorkerCategoriesUseCase(
        this.infra.userRepositoryFactory,
        this.infra.categoryRepository
      )
    }
    return this._updateWorkerCategoriesUseCase
  }

  get getS3UploadUrlUseCase(): IGetS3UploadUrlUseCase {
    if (!this._getS3UploadUrlUseCase) {
      this._getS3UploadUrlUseCase = new GetS3UploadUrlUseCase(
        this.infra.s3Service
      );
    }
    return this._getS3UploadUrlUseCase;
  }

  get getAvailableWorkersUseCase(): IGetAvailableWorkersUseCase {
    if (!this._getAvailableWorkersUseCase) {
      this._getAvailableWorkersUseCase = new GetAvailableWorkersUseCase(
        this.infra.workerRepository,
        this.infra.s3Service
      );
    }
    return this._getAvailableWorkersUseCase;
  }

  get getWorkerByIdUseCase(): IGetWorkerByIdUseCase {
    if (!this._getWorkerByIdUseCase) {
      this._getWorkerByIdUseCase = new GetWorkerByIdUseCase(
        this.infra.workerRepository,
        this.infra.categoryRepository,
        this.infra.reviewRepository,
        this.infra.userRepositoryFactory,
        this.infra.s3Service
      );
    }
    return this._getWorkerByIdUseCase;
  }

  get getWorkerAvailabilityUseCase(): IGetWorkerAvailabilityUseCase {
    if (!this._getWorkerAvailabilityUseCase) {
      this._getWorkerAvailabilityUseCase = new GetWorkerAvailabilityUseCase(
        this.infra.workerScheduleRepo
      )
    }
    return this._getWorkerAvailabilityUseCase;
  }

  get bookWorkerUseCase(): IBookWorkerUseCase {
    if (!this._bookWorkerUseCase) {
      this._bookWorkerUseCase = new BookWorkerUseCase(
        this.infra.serviceRepository,
        this.infra.workerRepository,
        this.infra.workerScheduleRepo
      )
    }
    return this._bookWorkerUseCase;
  }

  get getClientServiceHistoryUseCase(): IGetClientServiceHistoryUseCase {
    if (!this._getClientServiceHistoryUseCase) {
      this._getClientServiceHistoryUseCase = new GetClientServiceHistoryUseCase(
        this.infra.serviceRepository
      )
    }
    return this._getClientServiceHistoryUseCase
  }

  get getClientServiceByIdUseCase(): IGetClientServiceByIdUseCase {
    if (!this._getClientServiceByIdUseCase) {
      this._getClientServiceByIdUseCase = new GetClientServiceByIdUseCase(
        this.infra.serviceRepository
      )
    }
    return this._getClientServiceByIdUseCase
  }

  get getClientOngoingServicesUseCase(): IGetClientOngoingServicesUseCase {
    if (!this._getClientOngoingServicesUseCase) {
      this._getClientOngoingServicesUseCase = new GetClientOngoingServicesUseCase(
        this.infra.serviceRepository
      )
    }
    return this._getClientOngoingServicesUseCase
  }

  get getWorkerServicesUseCase(): IGetWorkerServicesUseCase {
    if (!this._getWorkerServicesUseCase) {
      this._getWorkerServicesUseCase = new GetWorkerServicesUseCase(
        this.infra.serviceRepository
      )
    }
    return this._getWorkerServicesUseCase
  }

  get getWorkerServiceDetailsUseCase(): IGetWorkerServiceDetailsUseCase {
    if (!this._getWorkerServiceDetailsUseCase) {
      this._getWorkerServiceDetailsUseCase = new GetWorkerServiceDetailsUseCase(
        this.infra.serviceRepository,
        this.infra.userRepositoryFactory,
        this.infra.s3Service
      )
    }
    return this._getWorkerServiceDetailsUseCase
  }

  get getActiveWorkerServiceUseCase(): IGetActiveWorkerServiceUseCase {
    if (!this._getActiveWorkerServiceUseCase) {
      this._getActiveWorkerServiceUseCase = new GetActiveWorkerServiceUseCase(
        this.infra.serviceRepository
      )
    }
    return this._getActiveWorkerServiceUseCase;
  }

  get getAllServicesUseCase(): IGetAllServicesUseCase {
    if (!this._getAllServicesUseCase) {
      this._getAllServicesUseCase = new GetAllServicesUseCase(
        this.infra.serviceRepository
      )
    }
    return this._getAllServicesUseCase
  }

  get getServiceDetailsForAdminUseCase(): IGetServiceDetailsForAdminUseCase {
    if (!this._getServiceDetailsForAdminUseCase) {
      this._getServiceDetailsForAdminUseCase = new GetServiceDetailsForAdminUseCase(
        this.infra.serviceRepository
      )
    }
    return this._getServiceDetailsForAdminUseCase
  }

  get startServiceUseCase(): IStartServiceUseCase {
    if (!this._startServiceUseCase) {
      this._startServiceUseCase = new StartServiceUseCase(
        this.infra.serviceRepository,
        this.sendNotificationUseCase
      )
    }
    return this._startServiceUseCase
  }

  get completeServiceUseCase(): ICompleteServiceUseCase {
    if (!this._completeServiceUseCase) {
      this._completeServiceUseCase = new CompleteServiceUseCase(
        this.infra.serviceRepository,
        this.infra.walletRepository,
        this.infra.transactionRepository,
        this.infra.userRepositoryFactory,
        this.sendNotificationUseCase
      )
    }
    return this._completeServiceUseCase
  }

  get blockWorkerDatesUsecase(): IBlockWorkerDatesUseCase {
    if (!this._blockWorkerDatesUsecase) {
      this._blockWorkerDatesUsecase = new BlockWorkerDatesUseCase(
        this.infra.workerScheduleRepo
      )
    }
    return this._blockWorkerDatesUsecase
  }

  get getWorkerBlockedDatesUseCase(): IGetWorkerBlockedDatesUseCase {
    if (!this._getWorkerBlockedDatesUseCase) {
      this._getWorkerBlockedDatesUseCase = new GetWorkerBlockedDatesUseCase(
        this.infra.workerScheduleRepo
      )
    }
    return this._getWorkerBlockedDatesUseCase;
  }

  get getClientScheduledMeetingsUseCase(): IGetClientScheduledMeetingsUseCase {
    if (!this._getClientScheduledMeetingsUseCase) {
      this._getClientScheduledMeetingsUseCase = new GetClientScheduledMeetingsUseCase(
        this.infra.serviceRepository
      )
    }
    return this._getClientScheduledMeetingsUseCase
  }

  get getClientMeetingsHistoryUseCase(): IGetClientMeetingsHistoryUseCase {
    if (!this._getClientMeetingsHistoryUseCase) {
      this._getClientMeetingsHistoryUseCase = new GetClientMeetingsHistoryUseCase(
        this.infra.serviceRepository
      )
    }
    return this._getClientMeetingsHistoryUseCase
  }

  get getWorkerScheduledMeetingsUseCase(): IGetWorkerScheduledMeetingsUseCase {
    if (!this._getWorkerScheduledMeetingsUseCase) {
      this._getWorkerScheduledMeetingsUseCase = new GetWorkerScheduledMeetingsUseCase(
        this.infra.serviceRepository
      )
    }
    return this._getWorkerScheduledMeetingsUseCase
  }

  get getWorkerMeetingsHistoryUseCase(): IGetWorkerMeetingsHistoryUseCase {
    if (!this._getWorkerMeetingsHistoryUseCase) {
      this._getWorkerMeetingsHistoryUseCase = new GetWorkerMeetingsHistoryUseCase(
        this.infra.serviceRepository
      )
    }
    return this._getWorkerMeetingsHistoryUseCase
  }

  get getClientMeetingByIdUseCase(): IGetClientMeetingByIdUseCase {
    if (!this._getClientMeetingByIdUseCase) {
      this._getClientMeetingByIdUseCase = new GetClientMeetingByIdUseCase(
        this.infra.serviceRepository
      )
    }
    return this._getClientMeetingByIdUseCase
  }

  get getWorkerMeetingByIdUseCase(): IGetWorkerMeetingByIdUseCase {
    if (!this._getWorkerMeetingByIdUseCase) {
      this._getWorkerMeetingByIdUseCase = new GetWorkerMeetingByIdUseCase(
        this.infra.serviceRepository
      )
    }
    return this._getWorkerMeetingByIdUseCase
  }


  get joinVideoCallUseCase(): IJoinVideoCallUseCase {
    if (!this._joinVideoCallUseCase) {
      this._joinVideoCallUseCase = new JoinVideoCallUseCase(
        this.infra.serviceRepository
      );
    }
    return this._joinVideoCallUseCase;
  }

  get endVideoCallUseCase(): IEndVideoCallUseCase {
    if (!this._endVideoCallUseCase) {
      this._endVideoCallUseCase = new EndVideoCallUseCase(
        this.infra.serviceRepository,
        this.infra.walletRepository,
        this.infra.transactionRepository,
        this.infra.userRepositoryFactory
      );
    }
    return this._endVideoCallUseCase;
  }

  get leaveVideoCallUseCase(): ILeaveVideoCallUseCase {
    if (!this._leaveVideoCallUseCase) {
      this._leaveVideoCallUseCase = new LeaveVideoCallUseCase(
        this.infra.serviceRepository
      );
    }
    return this._leaveVideoCallUseCase;
  }

  get createPaymentUseCase(): ICreatePaymentUseCase {
    if (!this._createPaymentUseCase) {
      this._createPaymentUseCase = new CreatePaymentUseCase(
        this.infra.paymentRepository,
        this.infra.paymentGateway,
        this.infra.serviceRepository
      )
    }
    return this._createPaymentUseCase
  }

  get verifyPaymentUseCase(): IVerifyPaymentUseCase {
    if (!this._verifyPaymentUseCase) {
      this._verifyPaymentUseCase = new VerifyPaymentUseCase(
        this.infra.paymentRepository,
        this.infra.paymentGateway,
        this.infra.serviceRepository,
        this.infra.walletRepository,
        this.infra.transactionRepository,
        this.infra.workerScheduleRepo,
        this.infra.userRepositoryFactory,
        this.sendNotificationUseCase
      )
    }
    return this._verifyPaymentUseCase;
  }

  get processWalletPaymentUseCase(): ProcessWalletPaymentUseCase {
    if (!this._processWalletPaymentUseCase) {
      this._processWalletPaymentUseCase = new ProcessWalletPaymentUseCase(
        this.infra.paymentRepository,
        this.infra.serviceRepository,
        this.infra.walletRepository,
        this.infra.transactionRepository,
        this.infra.workerScheduleRepo,
        this.infra.userRepositoryFactory,
        this.sendNotificationUseCase
      );
    }
    return this._processWalletPaymentUseCase;
  }

  get getWalletBalanceUseCase(): IGetWalletBalanceUseCase {
    if (!this._getWalletBalanceUseCase) {
      this._getWalletBalanceUseCase = new GetWalletBalanceUseCase(
        this.infra.walletRepository
      );
    }
    return this._getWalletBalanceUseCase;
  }

  get createRechargeOrderUseCase(): ICreateRechargeOrderUseCase {
    if (!this._createRechargeOrderUseCase) {
      this._createRechargeOrderUseCase = new CreateRechargeOrderUseCase(
        this.infra.paymentGateway
      );
    }
    return this._createRechargeOrderUseCase;
  }

  get verifyRechargePaymentUseCase(): IVerifyRechargePaymentUseCase {
    if (!this._verifyRechargePaymentUseCase) {
      this._verifyRechargePaymentUseCase = new VerifyRechargePaymentUseCase(
        this.infra.paymentGateway,
        this.infra.walletRepository,
        this.infra.transactionRepository
      );
    }
    return this._verifyRechargePaymentUseCase;
  }

  get getMeetingByIdForAdminUseCase(): IGetMeetingByIdForAdminUseCase {
    if (!this._getMeetingByIdForAdminUseCase) {
      this._getMeetingByIdForAdminUseCase = new GetMeetingByIdForAdminUseCase(
        this.infra.serviceRepository
      )
    }
    return this._getMeetingByIdForAdminUseCase
  }

  get getAllMeetingsForAdminUseCase(): IGetAllMeetingsForAdminUseCase {
    if (!this._getAllMeetingsForAdminUseCase) {
      this._getAllMeetingsForAdminUseCase = new GetAllMeetingsForAdminUseCase(
        this.infra.serviceRepository
      )
    }
    return this._getAllMeetingsForAdminUseCase
  }

  get cancelServiceUseCase(): ICancelServiceUseCase {
    if (!this._cancelServiceUseCase) {
      this._cancelServiceUseCase = new CancelServiceUseCase(
        this.infra.serviceRepository,
        this.infra.workerScheduleRepo,
        this.infra.walletRepository,
        this.infra.transactionRepository,
        this.infra.userRepositoryFactory,
        this.sendNotificationUseCase
      )
    }
    return this._cancelServiceUseCase
  }

  get getTransactionsUseCase(): IGetTransactionsUseCase {
    if (!this._getTransactionsUseCase) {
      this._getTransactionsUseCase = new GetTransactionsUseCase(
        this.infra.transactionRepository
      )
    }
    return this._getTransactionsUseCase
  }

  get getClientTransactionsUseCase(): IGetClientTransactionsUseCase {
    if (!this._getClientTransactionsUseCase) {
      this._getClientTransactionsUseCase = new GetClientTransactionsUseCase(
        this.infra.transactionRepository
      );
    }
    return this._getClientTransactionsUseCase;
  }

  get getWorkerTransactionsUseCase(): IGetWorkerTransactionsUseCase {
    if (!this._getWorkerTransactionsUseCase) {
      this._getWorkerTransactionsUseCase = new GetWorkerTransactionsUseCase(
        this.infra.transactionRepository
      );
    }
    return this._getWorkerTransactionsUseCase;
  }

  get getAllTransactionsUseCase(): IGetAllTransactionsUseCase {
    if (!this._getAllTransactionsUseCase) {
      this._getAllTransactionsUseCase = new GetAllTransactionsUseCase(
        this.infra.transactionRepository
      );
    }
    return this._getAllTransactionsUseCase;
  }

  get createConcernUseCase(): ICreateConcernUseCase {
    if (!this._createConcernUseCase) {
      this._createConcernUseCase = new CreateConcernUseCase(
        this.infra.concernRepository,
        this.infra.serviceRepository,
        this.infra.s3Service
      );
    }
    return this._createConcernUseCase;
  }

  get getAllConcernsUseCase(): IGetAllConcernsUseCase {
    if (!this._getAllConcernsUseCase) {
      this._getAllConcernsUseCase = new GetAllConcernsUseCase(
        this.infra.concernRepository,
        this.infra.serviceRepository,
        this.infra.userRepositoryFactory,
        this.infra.s3Service
      );
    }
    return this._getAllConcernsUseCase;
  }

  get getUserConcernsUseCase(): IGetUserConcernsUseCase {
    if (!this._getUserConcernsUseCase) {
      this._getUserConcernsUseCase = new GetUserConcernsUseCase(
        this.infra.concernRepository
      );
    }
    return this._getUserConcernsUseCase;
  }

  get addReviewUseCase(): IAddReviewUseCase {
    if (!this._addReviewUseCase) {
      this._addReviewUseCase = new AddReviewUseCase(
        this.infra.reviewRepository,
        this.infra.serviceRepository,
        this.infra.workerRepository
      )
    }
    return this._addReviewUseCase;
  }

  get sendNotificationUseCase(): ISendNotificationUseCase {
    if (!this._sendNotificationUseCase) {
      this._sendNotificationUseCase = new SendNotificationUseCase(
        this.infra.realtimeService,
        this.infra.notificationRepository
      )
    }
    return this._sendNotificationUseCase
  }

  get sendMessageUseCase(): ISendMessageUseCase {
    if (!this._sendMessageUseCase) {
      this._sendMessageUseCase = new SendMessageUseCase(
        this.infra.chatRepository,
        this.infra.realtimeService
      )
    }
    return this._sendMessageUseCase;
  }

  get getMessagesUseCase(): IGetMessagesUseCase {
    if (!this._getMessagesUseCase) {
      this._getMessagesUseCase = new GetMessagesUseCase(
        this.infra.chatRepository,
      )
    }
    return this._getMessagesUseCase;
  }

}