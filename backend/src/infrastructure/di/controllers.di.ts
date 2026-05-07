import { AdminController } from "../../presentation/controllers/admin/AdminController";
import { AuthController } from "../../presentation/controllers/auth/AuthController";
import { CategoryController } from "../../presentation/controllers/worker/CategoryController";
import { ClientServiceController } from "../../presentation/controllers/client/ClientServiceController";
import { ClientController } from "../../presentation/controllers/client/ClientWorkerController";
import { GoogleAuthController } from "../../presentation/controllers/auth/GoogleAuthController";
import { MediaController } from "../../presentation/controllers/auth/MediaController";
import { UploadController } from "../../presentation/controllers/auth/UploadController";
import { UserController } from "../../presentation/controllers/auth/UserController";
import { UserProfileController } from "../../presentation/controllers/auth/UserProfileController";
import { IAdminController } from "../../presentation/interfaces/IAdminController";
import { IAuthController } from "../../presentation/interfaces/IAuthController";
import { ICategoryController } from "../../presentation/interfaces/ICategoryController";
import { IGoogleAuthController } from "../../presentation/interfaces/IGoogleAuthController";
import { IUploadController } from "../../presentation/interfaces/IUploadController";
import { IUserController } from "../../presentation/interfaces/IUserController";
import { IUserProfileController } from "../../presentation/interfaces/IUserProfileController";
import { AuthMiddleware } from "../../presentation/middlewares/AuthMiddleware";
import { InfrastructureDI } from "./infrastructure.di";
import { UseCaseDI } from "./usecases.di";
import { WorkerServiceController } from "../../presentation/controllers/worker/WorkerServiceController";
import { AdminServiceController } from "../../presentation/controllers/admin/AdminServiceController";
import { WorkerController } from "../../presentation/controllers/worker/WorkerController";
import { ClientMeetingsController } from "../../presentation/controllers/client/ClientMeetingController";
import { WorkerMeetingsController } from "../../presentation/controllers/worker/WorkerMeetingController";
import { VideoCallController } from "../../presentation/controllers/common/videoCallController";
import { PaymentController } from "../../presentation/controllers/payment/PaymentController";
import { AdminMeetingController } from "../../presentation/controllers/admin/AdminMeetingController";
import { WalletController } from "../../presentation/controllers/wallet/WalletController";
import { ConcernController } from "../../presentation/controllers/concern/ConcernController";
import { AdminConcernController } from "../../presentation/controllers/admin/AdminConcernController ";
import { ClientReviewController } from "../../presentation/controllers/client/ClientReviewController";
import { NotificationController } from "../../presentation/controllers/notification/NotificationController";
import { GetUserNotificationsUseCase } from "../../application/use-cases/notification/GetUserNotificationsUseCase";
import { MarkNotificationReadUseCase } from "../../application/use-cases/notification/MarkNotificationReadUseCase";
import { ChatController } from "../../presentation/controllers/chat/ChatController";
import { TransactionController } from "../../presentation/controllers/payment/TransactionController";

export class ControllerDI {
    private _authController?: IAuthController;
    private _authMiddleware?: AuthMiddleware;
    private _googleAuthController?: IGoogleAuthController;

    private _adminController?: IAdminController;
    private _userController?: IUserController;
    private _clientController?: ClientController;
    private _clientServiceController?: ClientServiceController;
    private _adminServiceControler?: AdminServiceController;

    private _workerServiceController?: WorkerServiceController;
    private _workerController?: WorkerController;
    private _clientMeetingsController?: ClientMeetingsController;
    private _workerMeetingsController?: WorkerMeetingsController;

    private _uploadController?: IUploadController;
    private _userProfileController?: IUserProfileController;

    private _categoryController?: ICategoryController;

    private _mediaController?: MediaController;

    private _videoCallController?: VideoCallController;
    private _paymentController?: PaymentController;
    private _adminMeetingController?: AdminMeetingController;
    private _walletController?: WalletController;
    private _concernController?: ConcernController;
    private _adminConcernController?: AdminConcernController;
    private _clientReviewController?: ClientReviewController;
    private _notificationController?: NotificationController;
    private _chatController?: ChatController;
    private _transactionController?: TransactionController;

    constructor(
        private _useCases: UseCaseDI,
        private _infra: InfrastructureDI
    ) { };

    get authController(): IAuthController {
        if (!this._authController) {
            this._authController = new AuthController(
                this._useCases.registerUserUseCase,
                this._useCases.loginUserUseCase,
                this._useCases.sendOtpUseCase,
                this._useCases.verifyOtpUseCase,
                this._useCases.refreshTokenUseCase,
                this._useCases.forgotPasswordUseCase,
                this._useCases.resetPasswordUseCase,
                this._useCases.validateUserUseCase,
                this._useCases.changePasswordUseCase,
                this._infra.logger
            );
        }
        return this._authController;
    }

    get adminController(): IAdminController {
        if (!this._adminController) {
            this._adminController = new AdminController(
                this._useCases.getAllClientsUseCase,
                this._useCases.getAllWorkersUseCase,
                this._useCases.updateVerificationStatusUseCase,
                this._useCases.updateUserAccessUseCase,
                this._useCases.getAllUsersUseCase,
                this._useCases.getAdminDashboardDataUseCase
            );
        }
        return this._adminController;
    }

    get googleAuthController(): IGoogleAuthController {
        if (!this._googleAuthController) {
            this._googleAuthController = new GoogleAuthController(
                this._useCases.googleLoginUseCase
            );
        }
        return this._googleAuthController;
    }

    get userController(): IUserController {
        if (!this._userController) {
            this._userController = new UserController(
                this._useCases.changeUserRoleUseCase,
                this._useCases.getCurrentUserUseCase,
            )
        }
        return this._userController;
    }

    get authMiddleware(): AuthMiddleware {
        if (!this._authMiddleware) {
            this._authMiddleware = new AuthMiddleware(this._infra.tokenService);
        }
        return this._authMiddleware;
    }

    get uploadController(): IUploadController {
        if (!this._uploadController) {
            this._uploadController = new UploadController(
                this._useCases.uploadProfilePictureUseCase,
                this._useCases.uploadWorkerDocumentUseCase,
            );
        }
        return this._uploadController;
    }

    get userProfileController(): IUserProfileController {
        if (!this._userProfileController) {
            this._userProfileController = new UserProfileController(
                this._useCases.updateUserProfileUseCase,
                this._useCases.updateUserSkillsUseCase,
                this._useCases.addUserAddressUseCase,
                this._useCases.editUserAddressUseCase,
                this._useCases.deleteUserAddressUseCase
            );
        }
        return this._userProfileController
    }

    get categoryController(): ICategoryController {
        if (!this._categoryController) {
            this._categoryController = new CategoryController(
                this._useCases.createCategoryUseCase,
                this._useCases.getAllCategoriesUseCase,
                this._useCases.updateCategoryUseCase,
                this._useCases.updateCategoryStatusUseCase,
                this._useCases.updateWorkerCategoriesUseCase
            )
        }
        return this._categoryController
    }

    get mediaController(): MediaController {
        if (!this._mediaController) {
            this._mediaController = new MediaController(
                this._useCases.getS3UploadUrlUseCase
            )
        }
        return this._mediaController;
    }

    get clientController(): ClientController {
        if (!this._clientController) {
            this._clientController = new ClientController(
                this._useCases.getAvailableWorkersUseCase,
                this._useCases.getWorkerByIdUseCase,
                this._useCases.getWorkerAvailabilityUseCase,
            )
        }
        return this._clientController
    }

    get clientServiceController(): ClientServiceController {
        if (!this._clientServiceController) {
            this._clientServiceController = new ClientServiceController(
                this._useCases.getClientServiceHistoryUseCase,
                this._useCases.getClientServiceByIdUseCase,
                this._useCases.getClientOngoingServicesUseCase,
                this._useCases.bookWorkerUseCase,
                this._useCases.cancelServiceUseCase
            )
        }
        return this._clientServiceController
    }

    get workerServiceController(): WorkerServiceController {
        if (!this._workerServiceController) {
            this._workerServiceController = new WorkerServiceController(
                this._useCases.getWorkerServicesUseCase,
                this._useCases.getWorkerServiceDetailsUseCase,
                this._useCases.getActiveWorkerServiceUseCase,
                this._useCases.startServiceUseCase,
                this._useCases.completeServiceUseCase,
            )
        }
        return this._workerServiceController
    }

    get adminServiceController(): AdminServiceController {
        if (!this._adminServiceControler) {
            this._adminServiceControler = new AdminServiceController(
                this._useCases.getAllServicesUseCase,
                this._useCases.getServiceDetailsForAdminUseCase
            )
        }
        return this._adminServiceControler
    }

    get workerController(): WorkerController {
        if (!this._workerController) {
            this._workerController = new WorkerController(
                this._useCases.blockWorkerDatesUsecase,
                this._useCases.getWorkerBlockedDatesUseCase,
                this._useCases.getWorkerDashboardDataUseCase
            )
        }
        return this._workerController
    }

    get clientMeetingsController(): ClientMeetingsController {
        if (!this._clientMeetingsController) {
            this._clientMeetingsController = new ClientMeetingsController(
                this._useCases.getClientScheduledMeetingsUseCase,
                this._useCases.getClientMeetingsHistoryUseCase,
                this._useCases.getClientMeetingByIdUseCase,
            )
        }
        return this._clientMeetingsController
    }

    get workerMeetingsController(): WorkerMeetingsController {
        if (!this._workerMeetingsController) {
            this._workerMeetingsController = new WorkerMeetingsController(
                this._useCases.getWorkerScheduledMeetingsUseCase,
                this._useCases.getWorkerMeetingsHistoryUseCase,
                this._useCases.getWorkerMeetingByIdUseCase,
            )
        }
        return this._workerMeetingsController
    }

    get videoCallController(): VideoCallController {
        if (!this._videoCallController) {
            this._videoCallController = new VideoCallController(
                this._useCases.joinVideoCallUseCase,
                this._useCases.endVideoCallUseCase,
                this._useCases.leaveVideoCallUseCase
            );
        }
        return this._videoCallController;
    }

    get paymentController(): PaymentController {
        if (!this._paymentController) {
            this._paymentController = new PaymentController(
                this._useCases.createPaymentUseCase,
                this._useCases.verifyPaymentUseCase,
                this._useCases.processWalletPaymentUseCase
            );
        }
        return this._paymentController;
    }

    get adminMeetingController(): AdminMeetingController {
        if (!this._adminMeetingController) {
            this._adminMeetingController = new AdminMeetingController(
                this._useCases.getAllMeetingsForAdminUseCase,
                this._useCases.getMeetingByIdForAdminUseCase
            )
        }
        return this._adminMeetingController
    }

    get walletController(): WalletController {
        if (!this._walletController) {
            this._walletController = new WalletController(
                this._useCases.getWalletBalanceUseCase,
                this._useCases.getTransactionsUseCase,
                this._useCases.createRechargeOrderUseCase,
                this._useCases.verifyRechargePaymentUseCase
            );
        }
        return this._walletController;
    }

    get concernController(): ConcernController {
        if (!this._concernController) {
            this._concernController = new ConcernController(
                this._useCases.createConcernUseCase,
                this._useCases.getUserConcernsUseCase
            );
        }
        return this._concernController;
    }

    get adminConcernController(): AdminConcernController {
        if (!this._adminConcernController) {
            this._adminConcernController = new AdminConcernController(
                this._useCases.getAllConcernsUseCase
            );
        }
        return this._adminConcernController;
    }

    get clientReviewController(): ClientReviewController {
        if (!this._clientReviewController) {
            this._clientReviewController = new ClientReviewController(
                this._useCases.addReviewUseCase
            )
        }
        return this._clientReviewController
    }

    get notificationController(): NotificationController {
        if (!this._notificationController) {
            this._notificationController = new NotificationController(
                new GetUserNotificationsUseCase(this._infra.notificationRepository),
                new MarkNotificationReadUseCase(this._infra.notificationRepository)
            );
        }
        return this._notificationController;
    }

    get chatController(): ChatController {
        if (!this._chatController) {
            this._chatController = new ChatController(
                this._useCases.sendMessageUseCase,
                this._useCases.getMessagesUseCase
            )
        }
        return this._chatController
    }

    get transactionController(): TransactionController {
        if (!this._transactionController) {
            this._transactionController = new TransactionController(
                this._useCases.getClientTransactionsUseCase,
                this._useCases.getWorkerTransactionsUseCase,
                this._useCases.getAllTransactionsUseCase
            );
        }
        return this._transactionController;
    }
}
