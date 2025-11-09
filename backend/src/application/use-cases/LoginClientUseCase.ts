import { InvalidCredentialsError, UserBlockedError } from "../../domain/errors/DomainError";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { LoginUserDTO, UserResponseDTO } from "../dtos/UserDTO";
import { ILogger } from "../interfaces/ILogger";
import { ILoginClientUseCase } from "../interfaces/ILoginClientUseCase";
import { UserMapper } from "../mappers/UserMapper";
import { IPasswordHasher } from "../services/IPasswordHasher";
import { ITokenService } from "../services/ITokenService";

export class LoginClientUseCase implements ILoginClientUseCase {
    constructor(
        private readonly _clientRepository: IClientRepository,
        private readonly _passwordHasher: IPasswordHasher,
        private readonly _tokenService: ITokenService,
        private readonly _logger: ILogger
    ) { }

    async execute(userLoginData: LoginUserDTO): Promise<{
        user: UserResponseDTO; accessToken: string; refreshToken: string;
    }> {
        const { email_address, password } = userLoginData;

        // console.log(`[LoginUseCase] Executing with email: ${email_address}`);

        const user = await this._clientRepository.findByEmail(email_address);
        // console.log(user)

        if (!user) {
            const errorMessage = `[LoginUseCase] ERROR: User not found for email: ${email_address}`;
            this._logger.error(errorMessage);
            throw new InvalidCredentialsError();
        }
        if (user.isBlocked) {
            throw new UserBlockedError();
        }

        if (!user.passwordhash) {
            console.error(`[LoginUseCase] ERROR: User ${email_address} has no password hash.`);
            throw new InvalidCredentialsError();
        }

        const isValidPassword = await this._passwordHasher.compare(password, user.passwordhash);

        if (!isValidPassword) throw new InvalidCredentialsError();

        const userResponse = UserMapper.toResponseDTO(user);

        const accessToken = this._tokenService.generateAccessToken({ id: user.clientId, email: user.email, role: user.role });
        const refreshToken = this._tokenService.generateRefreshToken({ id: user.clientId, email: user.email, role: user.role });


        return {
            user: userResponse,
            accessToken,
            refreshToken
        }
    }
}

