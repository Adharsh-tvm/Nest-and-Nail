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

export class ControllerDI {
    private _authController?: IAuthController;
    private _authMiddleware?: AuthMiddleware;
    private _googleAuthController?: IGoogleAuthController;

    private _adminController?: IAdminController;
    private _userController?: IUserController;
    private _clientController?: ClientController;
    private _clientServiceController?: ClientServiceController;

    private _uploadController?: IUploadController;
    private _userProfileController?: IUserProfileController;

    private _categoryController?: ICategoryController;

    private _mediaController?: MediaController;

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
                this._useCases.validateUserUseCase
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
                this._useCases.getAllUsersUseCase
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
                this._useCases.bookWorkerUseCase
            )
        }
        return this._clientServiceController
    }
}

