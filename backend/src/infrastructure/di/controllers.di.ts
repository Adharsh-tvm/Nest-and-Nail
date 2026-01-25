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
        private useCases: UseCaseDI,
        private infra: InfrastructureDI
    ) { };

    get authController(): IAuthController {
        if (!this._authController) {
            this._authController = new AuthController(
                this.useCases.registerUserUseCase,
                this.useCases.loginUserUseCase,
                this.useCases.sendOtpUseCase,
                this.useCases.verifyOtpUseCase,
                this.useCases.refreshTokenUseCase,
                this.useCases.forgotPasswordUseCase,
                this.useCases.resetPasswordUseCase
            );
        }
        return this._authController;
    }

    get adminController(): IAdminController {
        if (!this._adminController) {
            this._adminController = new AdminController(
                this.useCases.getAllClientsUseCase,
                this.useCases.getAllWorkersUseCase,
                this.useCases.updateVerificationStatusUseCase,
                this.useCases.updateUserAccessUseCase
            );
        }
        return this._adminController;
    }

    get googleAuthController(): IGoogleAuthController {
        if (!this._googleAuthController) {
            this._googleAuthController = new GoogleAuthController(
                this.useCases.googleLoginUseCase
            );
        }
        return this._googleAuthController;
    }

    get userController(): IUserController {
        if (!this._userController) {
            this._userController = new UserController(
                this.useCases.changeUserRoleUseCase,
                this.useCases.getCurrentUserUseCase,
                this.useCases.getAllUsersUseCase
            )
        }
        return this._userController;
    }

    get authMiddleware(): AuthMiddleware {
        if (!this._authMiddleware) {
            this._authMiddleware = new AuthMiddleware(this.infra.tokenService);
        }
        return this._authMiddleware;
    }

    get uploadController(): IUploadController {
        if (!this._uploadController) {
            this._uploadController = new UploadController(
                this.useCases.uploadProfilePictureUseCase,
                this.useCases.uploadWorkerDocumentUseCase,
            );
        }
        return this._uploadController;
    }

    get userProfileController(): IUserProfileController {
        if (!this._userProfileController) {
            this._userProfileController = new UserProfileController(
                this.useCases.updateUserProfileUseCase,
                this.useCases.updateUserSkillsUseCase,
                this.useCases.updateUserAddressUseCase
            );
        }
        return this._userProfileController
    }

    get categoryController(): ICategoryController {
        if(!this._categoryController) {
            this._categoryController = new CategoryController(
                this.useCases.createCategoryUseCase,
                this.useCases.getAllCategoriesUseCase,
                this.useCases.updateCategoryStatusUseCase
            )
        }
        return this._categoryController
    }
}
    
