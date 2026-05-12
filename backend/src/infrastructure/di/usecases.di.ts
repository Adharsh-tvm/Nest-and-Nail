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
import { IProcessModerationActionsUseCase } from "../../application/interfaces/moderation/IProcessModerationActionsUseCase";
import { ProcessModerationActionsUseCase } from "../../application/use-cases/moderation/ProcessModerationActionsUseCase";

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
  private _processModerationActionsUseCase?: IProcessModerationActionsUseCase;



  constructor(private infra: InfrastructureDI) { }


  get registerUserUseCase(): IRegisterUserUseCase {
    return (this._registerUserUseCase ??= new RegisterUserUseCase(
        this.infra.userRepositoryFactory,
        this.infra.passwordHasher,
        this.infra.idGenerator,
        this.infra.tokenService,
        this.infra.logger
      ));
  }

  get loginUserUseCase(): ILoginUserUseCase {
    return (this._loginUserUseCase ??= new LoginUserUseCase(
        this.infra.userRepositoryFactory,
        this.infra.passwordHasher,
        this.infra.tokenService,
        this.infra.logger
      ));
  }

  get getAllClientsUseCase(): IGetAllClientsUseCase {
    return (this._getAllClientsUseCase ??= new GetAllClientsUseCase(this.infra.clientRepository));
  }

  get getAdminDashboardDataUseCase(): IGetAdminDashboardDataUseCase {
    return (this._getAdminDashboardDataUseCase ??= new GetAdminDashboardDataUseCase());
  }

  get getWorkerDashboardDataUseCase(): IGetWorkerDashboardDataUseCase {
    return (this._getWorkerDashboardDataUseCase ??= new GetWorkerDashboardDataUseCase());
  }

  get getAllWorkersUseCase(): IGetAllWorkersUseCase {
    return (this._getAllWorkersUseCase ??= new GetAllWorkersUseCase(
        this.infra.workerRepository,
        this.infra.s3Service
      ));
  }

  get googleLoginUseCase(): IGoogleSignUpUseCase {
    return (this._googleLoginUseCase ??= new GoogleSignUpUseCase(
        this.infra.userRepositoryFactory,
        this.infra.passwordHasher,
        this.infra.tokenService,
        this.infra.idGenerator
      ));
  }

  get sendOtpUseCase(): ISendOtpUseCase {
    return (this._sendOtpUseCase ??= new SendOtpUseCase(
        this.infra.emailService,
        this.infra.otpService,
        this.infra.otpRepository,
        this.infra.userRepositoryFactory,
        this.infra.logger
      ));
  }

  get verifyOtpUseCase(): IVerifyOtpUseCase {
    return (this._verifyOtpUseCase ??= new VerifyOtpUseCase(
        this.infra.otpService,
        this.infra.otpRepository,
        this.infra.logger));
  }

  get validateUserUseCase(): IValidateUserUseCase {
    return (this._validateUserUseCase ??= new ValidateUserUseCase(
        this.infra.userRepositoryFactory
      ));
  }


  get refreshTokenUseCase(): IRefreshTokenUseCase {
    return (this._refreshTokenUseCase ??= new RefreshTokenUseCase(
        this.infra.tokenService));
  }

  get forgotPasswordUseCase(): IForgotPasswordUseCase {
    return (this._forgotpasswordUseCase ??= new ForgotPasswordUseCase(
        this.infra.emailService,
        this.infra.otpService,
        this.infra.otpRepository,
        this.infra.userRepositoryFactory));
  }

  get resetPasswordUseCase(): IResetPasswordUseCase {
    return (this._resetPasswordUseCase ??= new ResetPasswordUseCase(
        this.infra.userRepositoryFactory,
        this.infra.passwordHasher,
        this.infra.otpRepository,
        this.infra.logger));
  }

  get changePasswordUseCase(): IChangePasswordUseCase {
    return (this._changePasswordUseCase ??= new ChangePasswordUseCase(
        this.infra.userRepositoryFactory,
        this.infra.passwordHasher,
        this.infra.logger
      ));
  }

  get changeUserRoleUseCase(): IChangeUserRoleUseCase {
    return (this._changeUserRoleuseCase ??= new ChangeUserRoleUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger,
        this.infra.tokenService
      ));
  }

  get getCurrentUserUseCase(): IGetCurrentUserUseCase {
    return (this._getCurrentUserUseCase ??= new GetCurrentUserUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger,
        this.infra.s3Service
      ));
  }

  get uploadProfilePictureUseCase(): IUploadProfilePictureUseCase {
    return (this._uploadProfilePictureUseCase ??= new UploadProfilePictureUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger,
        this.infra.s3Service
      ));
  }

  get uploadWorkerDocumentUseCase(): IUploadWorkerDocumentUseCase {
    return (this._uploadWorkerDocumentUseCase ??= new UploadWorkerDocumentUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger,
        this.infra.s3Service
      ));
  }

  get updateUserProfileUseCase(): IUpdateUserProfileUseCase {
    return (this._updateUserProfileUseCase ??= new UpdateUserProfileUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger,
        this.uploadProfilePictureUseCase
      ));
  }

  get getAllUsersUseCase(): IGetAllUsersUseCase {
    return (this._getAllUsersUseCase ??= new GetAllUsersUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger,
        this.infra.s3Service
      ));
  }

  get updateVerificationStatusUseCase(): IUpdateVerificationStatusUseCase {
    return (this._updateVerificationStatusUseCase ??= new UpdateVerificationStatusUseCase(
        this.infra.userRepositoryFactory,
        this.infra.emailService,
        this.infra.logger,
        this.sendNotificationUseCase
      ));
  }

  get updateUserAccessUseCase(): IUpdateUserAccessUseCase {
    return (this._updateUserAccessUseCase ??= new UpdateUserAccessUseCase(
        this.infra.userRepositoryFactory,
        this.infra.logger
      ));
  }

  get updateUserSkillsUseCase(): IUpdateUserSkillsUseCase {
    return (this._updateUserSkillUseCase ??= new UpdateUserSkillsUseCase(
        this.infra.userRepositoryFactory
      ));
  }

  get addUserAddressUseCase(): IAddUserAddressUseCase {
    return (this._addUserAddressUseCase ??= new AddUserAddressUseCase(
        this.infra.userRepositoryFactory
      ));
  }

  get editUserAddressUseCase(): IEditUserAddressUseCase {
    return (this._editUserAddressUseCase ??= new EditUserAddressUseCase(
        this.infra.userRepositoryFactory
      ));
  }

  get deleteUserAddressUseCase(): IDeleteUserAddressUseCase {
    return (this._deleteUserAddressUseCase ??= new DeleteUserAddressUseCase(
        this.infra.userRepositoryFactory
      ));
  }

  get createCategoryUseCase(): ICreateCategoryUseCase {
    return (this._createCategoryUseCase ??= new CreateCategoryUseCase(
        this.infra.categoryRepository
      ));
  }

  get getAllCategoriesUseCase(): IGetAllCategoriesUseCase {
    return (this._getAllCategoriesUseCase ??= new GetAllCategoriesUseCase(
        this.infra.categoryRepository
      ));
  }

  get updateCategoryUseCase(): IUpdateCategoryUseCase {
    return (this._updateCategoryUseCase ??= new UpdateCategoryUseCase(
        this.infra.categoryRepository
      ));
  }

  get updateCategoryStatusUseCase(): IUpdateCategoryStatusUseCase {
    return (this._updateCategoryStatusUseCase ??= new UpdateCategoryStatusUseCase(
        this.infra.categoryRepository
      ));
  }

  get updateWorkerCategoriesUseCase(): IUpdateWorkerCategoriesUseCase {
    return (this._updateWorkerCategoriesUseCase ??= new UpdateWorkerCategoriesUseCase(
        this.infra.userRepositoryFactory,
        this.infra.categoryRepository
      ));
  }

  get getS3UploadUrlUseCase(): IGetS3UploadUrlUseCase {
    return (this._getS3UploadUrlUseCase ??= new GetS3UploadUrlUseCase(
        this.infra.s3Service
      ));
  }

  get getAvailableWorkersUseCase(): IGetAvailableWorkersUseCase {
    return (this._getAvailableWorkersUseCase ??= new GetAvailableWorkersUseCase(
        this.infra.workerRepository,
        this.infra.s3Service
      ));
  }

  get getWorkerByIdUseCase(): IGetWorkerByIdUseCase {
    return (this._getWorkerByIdUseCase ??= new GetWorkerByIdUseCase(
        this.infra.workerRepository,
        this.infra.categoryRepository,
        this.infra.reviewRepository,
        this.infra.userRepositoryFactory,
        this.infra.s3Service
      ));
  }

  get getWorkerAvailabilityUseCase(): IGetWorkerAvailabilityUseCase {
    return (this._getWorkerAvailabilityUseCase ??= new GetWorkerAvailabilityUseCase(
        this.infra.workerScheduleRepo
      ));
  }

  get bookWorkerUseCase(): IBookWorkerUseCase {
    return (this._bookWorkerUseCase ??= new BookWorkerUseCase(
        this.infra.serviceRepository,
        this.infra.workerRepository,
        this.infra.workerScheduleRepo,
        this.infra.userRepository,
        this.infra.clientWorkerRestrictionRepository
      ));
  }

  get getClientServiceHistoryUseCase(): IGetClientServiceHistoryUseCase {
    return (this._getClientServiceHistoryUseCase ??= new GetClientServiceHistoryUseCase(
        this.infra.serviceRepository
      ));
  }

  get getClientServiceByIdUseCase(): IGetClientServiceByIdUseCase {
    return (this._getClientServiceByIdUseCase ??= new GetClientServiceByIdUseCase(
        this.infra.serviceRepository,
        this.infra.reviewRepository
      ));
  }

  get getClientOngoingServicesUseCase(): IGetClientOngoingServicesUseCase {
    return (this._getClientOngoingServicesUseCase ??= new GetClientOngoingServicesUseCase(
        this.infra.serviceRepository
      ));
  }

  get getWorkerServicesUseCase(): IGetWorkerServicesUseCase {
    return (this._getWorkerServicesUseCase ??= new GetWorkerServicesUseCase(
        this.infra.serviceRepository
      ));
  }

  get getWorkerServiceDetailsUseCase(): IGetWorkerServiceDetailsUseCase {
    return (this._getWorkerServiceDetailsUseCase ??= new GetWorkerServiceDetailsUseCase(
        this.infra.serviceRepository,
        this.infra.userRepositoryFactory,
        this.infra.s3Service,
        this.infra.reviewRepository
      ));
  }

  get getActiveWorkerServiceUseCase(): IGetActiveWorkerServiceUseCase {
    return (this._getActiveWorkerServiceUseCase ??= new GetActiveWorkerServiceUseCase(
        this.infra.serviceRepository
      ));
  }

  get getAllServicesUseCase(): IGetAllServicesUseCase {
    return (this._getAllServicesUseCase ??= new GetAllServicesUseCase(
        this.infra.serviceRepository
      ));
  }

  get getServiceDetailsForAdminUseCase(): IGetServiceDetailsForAdminUseCase {
    return (this._getServiceDetailsForAdminUseCase ??= new GetServiceDetailsForAdminUseCase(
        this.infra.serviceRepository
      ));
  }

  get startServiceUseCase(): IStartServiceUseCase {
    return (this._startServiceUseCase ??= new StartServiceUseCase(
        this.infra.serviceRepository,
        this.sendNotificationUseCase
      ));
  }

  get completeServiceUseCase(): ICompleteServiceUseCase {
    return (this._completeServiceUseCase ??= new CompleteServiceUseCase(
        this.infra.serviceRepository,
        this.infra.walletRepository,
        this.infra.transactionRepository,
        this.infra.userRepositoryFactory,
        this.sendNotificationUseCase
      ));
  }

  get blockWorkerDatesUsecase(): IBlockWorkerDatesUseCase {
    return (this._blockWorkerDatesUsecase ??= new BlockWorkerDatesUseCase(
        this.infra.workerScheduleRepo
      ));
  }

  get getWorkerBlockedDatesUseCase(): IGetWorkerBlockedDatesUseCase {
    return (this._getWorkerBlockedDatesUseCase ??= new GetWorkerBlockedDatesUseCase(
        this.infra.workerScheduleRepo
      ));
  }

  get getClientScheduledMeetingsUseCase(): IGetClientScheduledMeetingsUseCase {
    return (this._getClientScheduledMeetingsUseCase ??= new GetClientScheduledMeetingsUseCase(
        this.infra.serviceRepository
      ));
  }

  get getClientMeetingsHistoryUseCase(): IGetClientMeetingsHistoryUseCase {
    return (this._getClientMeetingsHistoryUseCase ??= new GetClientMeetingsHistoryUseCase(
        this.infra.serviceRepository
      ));
  }

  get getWorkerScheduledMeetingsUseCase(): IGetWorkerScheduledMeetingsUseCase {
    return (this._getWorkerScheduledMeetingsUseCase ??= new GetWorkerScheduledMeetingsUseCase(
        this.infra.serviceRepository
      ));
  }

  get getWorkerMeetingsHistoryUseCase(): IGetWorkerMeetingsHistoryUseCase {
    return (this._getWorkerMeetingsHistoryUseCase ??= new GetWorkerMeetingsHistoryUseCase(
        this.infra.serviceRepository
      ));
  }

  get getClientMeetingByIdUseCase(): IGetClientMeetingByIdUseCase {
    return (this._getClientMeetingByIdUseCase ??= new GetClientMeetingByIdUseCase(
        this.infra.serviceRepository
      ));
  }

  get getWorkerMeetingByIdUseCase(): IGetWorkerMeetingByIdUseCase {
    return (this._getWorkerMeetingByIdUseCase ??= new GetWorkerMeetingByIdUseCase(
        this.infra.serviceRepository
      ));
  }


  get joinVideoCallUseCase(): IJoinVideoCallUseCase {
    return (this._joinVideoCallUseCase ??= new JoinVideoCallUseCase(
        this.infra.serviceRepository,
        this.sendNotificationUseCase
      ));
  }

  get endVideoCallUseCase(): IEndVideoCallUseCase {
    return (this._endVideoCallUseCase ??= new EndVideoCallUseCase(
        this.infra.serviceRepository,
        this.infra.walletRepository,
        this.infra.transactionRepository,
        this.infra.userRepositoryFactory
      ));
  }

  get leaveVideoCallUseCase(): ILeaveVideoCallUseCase {
    return (this._leaveVideoCallUseCase ??= new LeaveVideoCallUseCase(
        this.infra.serviceRepository
      ));
  }

  get createPaymentUseCase(): ICreatePaymentUseCase {
    return (this._createPaymentUseCase ??= new CreatePaymentUseCase(
        this.infra.paymentRepository,
        this.infra.paymentGateway,
        this.infra.serviceRepository
      ));
  }

  get verifyPaymentUseCase(): IVerifyPaymentUseCase {
    return (this._verifyPaymentUseCase ??= new VerifyPaymentUseCase(
        this.infra.paymentRepository,
        this.infra.paymentGateway,
        this.infra.serviceRepository,
        this.infra.walletRepository,
        this.infra.transactionRepository,
        this.infra.workerScheduleRepo,
        this.infra.userRepositoryFactory,
        this.sendNotificationUseCase
      ));
  }

  get processWalletPaymentUseCase(): ProcessWalletPaymentUseCase {
    return (this._processWalletPaymentUseCase ??= new ProcessWalletPaymentUseCase(
        this.infra.paymentRepository,
        this.infra.serviceRepository,
        this.infra.walletRepository,
        this.infra.transactionRepository,
        this.infra.workerScheduleRepo,
        this.infra.userRepositoryFactory,
        this.sendNotificationUseCase
      ));
  }

  get getWalletBalanceUseCase(): IGetWalletBalanceUseCase {
    return (this._getWalletBalanceUseCase ??= new GetWalletBalanceUseCase(
        this.infra.walletRepository
      ));
  }

  get createRechargeOrderUseCase(): ICreateRechargeOrderUseCase {
    return (this._createRechargeOrderUseCase ??= new CreateRechargeOrderUseCase(
        this.infra.paymentGateway
      ));
  }

  get verifyRechargePaymentUseCase(): IVerifyRechargePaymentUseCase {
    return (this._verifyRechargePaymentUseCase ??= new VerifyRechargePaymentUseCase(
        this.infra.paymentGateway,
        this.infra.walletRepository,
        this.infra.transactionRepository
      ));
  }

  get getMeetingByIdForAdminUseCase(): IGetMeetingByIdForAdminUseCase {
    return (this._getMeetingByIdForAdminUseCase ??= new GetMeetingByIdForAdminUseCase(
        this.infra.serviceRepository
      ));
  }

  get getAllMeetingsForAdminUseCase(): IGetAllMeetingsForAdminUseCase {
    return (this._getAllMeetingsForAdminUseCase ??= new GetAllMeetingsForAdminUseCase(
        this.infra.serviceRepository
      ));
  }

  get cancelServiceUseCase(): ICancelServiceUseCase {
    return (this._cancelServiceUseCase ??= new CancelServiceUseCase(
        this.infra.serviceRepository,
        this.infra.workerScheduleRepo,
        this.infra.walletRepository,
        this.infra.transactionRepository,
        this.infra.userRepositoryFactory,
        this.sendNotificationUseCase
      ));
  }

  get getTransactionsUseCase(): IGetTransactionsUseCase {
    return (this._getTransactionsUseCase ??= new GetTransactionsUseCase(
        this.infra.transactionRepository
      ));
  }

  get getClientTransactionsUseCase(): IGetClientTransactionsUseCase {
    return (this._getClientTransactionsUseCase ??= new GetClientTransactionsUseCase(
        this.infra.transactionRepository
      ));
  }

  get getWorkerTransactionsUseCase(): IGetWorkerTransactionsUseCase {
    return (this._getWorkerTransactionsUseCase ??= new GetWorkerTransactionsUseCase(
        this.infra.transactionRepository
      ));
  }

  get getAllTransactionsUseCase(): IGetAllTransactionsUseCase {
    return (this._getAllTransactionsUseCase ??= new GetAllTransactionsUseCase(
        this.infra.transactionRepository
      ));
  }

  get createConcernUseCase(): ICreateConcernUseCase {
    return (this._createConcernUseCase ??= new CreateConcernUseCase(
        this.infra.concernRepository,
        this.infra.serviceRepository,
        this.infra.s3Service
      ));
  }

  get getAllConcernsUseCase(): IGetAllConcernsUseCase {
    return (this._getAllConcernsUseCase ??= new GetAllConcernsUseCase(
        this.infra.concernRepository,
        this.infra.serviceRepository,
        this.infra.userRepositoryFactory,
        this.infra.s3Service
      ));
  }

  get getUserConcernsUseCase(): IGetUserConcernsUseCase {
    return (this._getUserConcernsUseCase ??= new GetUserConcernsUseCase(
        this.infra.concernRepository
      ));
  }

  get addReviewUseCase(): IAddReviewUseCase {
    return (this._addReviewUseCase ??= new AddReviewUseCase(
        this.infra.reviewRepository,
        this.infra.serviceRepository,
        this.infra.workerRepository
      ));
  }

  get sendNotificationUseCase(): ISendNotificationUseCase {
    return (this._sendNotificationUseCase ??= new SendNotificationUseCase(
        this.infra.realtimeService,
        this.infra.notificationRepository
      ));
  }

  get sendMessageUseCase(): ISendMessageUseCase {
    return (this._sendMessageUseCase ??= new SendMessageUseCase(
        this.infra.chatRepository,
        this.infra.realtimeService
      ));
  }

  get getMessagesUseCase(): IGetMessagesUseCase {
    return (this._getMessagesUseCase ??= new GetMessagesUseCase(
        this.infra.chatRepository,
      ));
  }

  get processModerationActionsUseCase(): IProcessModerationActionsUseCase {
    return (this._processModerationActionsUseCase ??= new ProcessModerationActionsUseCase(
        this.infra.serviceRepository,
        this.infra.workerRepository,
        this.infra.userRepository,
        this.infra.walletRepository,
        this.infra.transactionRepository,
        this.infra.clientWorkerRestrictionRepository,
        this.infra.userRepositoryFactory,
        this.sendNotificationUseCase
      ));
  }
}