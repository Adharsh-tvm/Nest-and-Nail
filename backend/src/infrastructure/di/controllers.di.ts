import { AdminController } from "../../presentation/controllers/AdminController";
import { AuthController } from "../../presentation/controllers/AuthController";
import { CategoryController } from "../../presentation/controllers/CategoryController";
import { GoogleAuthController } from "../../presentation/controllers/GoogleAuthController";
import { UploadController } from "../../presentation/controllers/UploadController";
import { UserController } from "../../presentation/controllers/UserController";
import { UserProfileController } from "../../presentation/controllers/UserProfileController";
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

    private _uploadController?: IUploadController;
    private _userProfileController?: IUserProfileController;

    private _categoryController?: ICategoryController;

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
                this._useCases.resetPasswordUseCase
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
                this._useCases.updateUserAccessUseCase
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
                this._useCases.getAllUsersUseCase
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
                this._useCases.updateUserAddressUseCase
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
            )
        }
        return this._categoryController
    }
}

