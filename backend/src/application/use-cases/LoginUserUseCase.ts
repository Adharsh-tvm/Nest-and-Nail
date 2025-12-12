import { InvalidCredentialsError, UserBlockedError } from "../../domain/errors/DomainError";
import { LoginUserDTO, UserResponseDTO } from "../dtos/UserDTO";
import { ILogger } from "../interfaces/ILogger";
import { ILoginUserUseCase } from "../interfaces/ILoginUserUseCase";
import { UserMapper } from "../mappers/UserMapper";
import { IPasswordHasher } from "../services/IPasswordHasher";
import { ITokenService } from "../services/ITokenService";
import { UserRepositoryFactory } from "../../infrastructure/repo/UserRepositoryFactory";
import { Role } from "../../domain/enums/enums";
import { User } from "../../domain/entities/User";

export class LoginUserUseCase implements ILoginUserUseCase {
    constructor(
        private readonly _repositoryFactory: UserRepositoryFactory,
        private readonly _passwordHasher: IPasswordHasher,
        private readonly _tokenService: ITokenService,
        private readonly _logger: ILogger
    ) { }

    async execute(userLoginData: LoginUserDTO): Promise<{
        user: UserResponseDTO; accessToken: string; refreshToken: string;
    }> {
        const { email_address, password } = userLoginData;

        this._logger.info(`[LoginUserUseCase] Login attempt for ${email_address}`);

        let user: User | null = null;
        let userRole: Role | null = null;

        try {
            const clientRepo = this._repositoryFactory.getRepository(Role.CLIENT);
            user = await clientRepo.findByEmail(email_address);
            if (user) {
                userRole = Role.CLIENT;
                this._logger.info(`[LoginUserUseCase] User found as CLIENT`);
            }
        } catch (error) {
            this._logger.info(`[LoginUserUseCase] User not found in CLIENT repository`);
        }

        if (!user) {
            try {
                const workerRepo = this._repositoryFactory.getRepository(Role.WORKER);
                user = await workerRepo.findByEmail(email_address);
                if (user) {
                    userRole = Role.WORKER;
                    this._logger.info(`[LoginUserUseCase] User found as WORKER`);
                }
            } catch (error) {
                this._logger.info(`[LoginUserUseCase] User not found in WORKER repository`);
            }
        }

        if (!user) {
            try {
                const adminRepo = this._repositoryFactory.getRepository(Role.ADMIN);
                user = await adminRepo.findByEmail(email_address);
                if (user) {
                    userRole = Role.ADMIN;
                    this._logger.info(`[LoginUserUseCase] User found as ADMIN`);
                }
            } catch (error) {
                this._logger.info(`[LoginUserUseCase] User not found in ADMIN repository`);
            }
        }

        if (!user || !userRole) {
            const errorMessage = `[LoginUseCase] ERROR: User not found for email: ${email_address}`;
            this._logger.error(errorMessage);
            throw new InvalidCredentialsError();
        }

        if (user.isBlocked) {
            this._logger.warn(`[LoginUserUseCase] User is blocked: ${email_address}`);
            throw new UserBlockedError();
        }

        if (!user.passwordhash) {
            this._logger.error(`[LoginUseCase] ERROR: User ${email_address} has no password hash.`);
            throw new InvalidCredentialsError();
        }

        this._logger.info(`[LoginUserUseCase] Verifying password`);
        const isValidPassword = await this._passwordHasher.compare(password, user.passwordhash);
        if (!isValidPassword) {
            this._logger.error(`[LoginUserUseCase] Invalid password for ${email_address}`);
            throw new InvalidCredentialsError();
        }

        this._logger.info(`[LoginUserUseCase] Password verified, mapping response`);
        const userResponse = UserMapper.toResponseDTO(user);

        this._logger.info(`[LoginUserUseCase] User response: ${JSON.stringify(userResponse)}`);

        const accessToken = this._tokenService.generateAccessToken({
            id: user.userId,
            name: user.name,
            email: user.email,
            role: user.role
        });
        const refreshToken = this._tokenService.generateRefreshToken({
            id: user.userId,
            name: user.name,
            email: user.email,
            role: user.role
        });

        this._logger.info(`[LoginUserUseCase] Tokens generated successfully for role: ${userRole}`);

        return {
            user: userResponse,
            accessToken,
            refreshToken
        };
    }
}