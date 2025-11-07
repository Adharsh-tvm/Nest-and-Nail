import { IClientRepository } from "../../domain/repositories/ICustomerRepository";
import { UserRequestDTO, UserResponseDTO } from "../dtos/UserDTO";
import { LoginMethod } from "../../shared/enums/enums";
import { IGoogleAuthUseCase } from "../interfaces/IGoogleAuthUseCase";
import { UserMapper } from "../mappers/UserMapper";
import { IGenerateUserID } from "../services/IGenerateUserID";
import { ITokenService } from "../services/ITokenService";

export class GoogleAuthUseCase implements IGoogleAuthUseCase {
    constructor(
        private readonly _clientRepository: IClientRepository,
        private readonly _userIdGenerator: IGenerateUserID,
        private readonly _tokenService: ITokenService
    ) { }

    async execute(
        userData: UserRequestDTO
    ): Promise<{ user: UserResponseDTO; accessToken: string; refreshToken: string; }> {
        const existingUser = await this._clientRepository.findByEmail(userData.email_address);

        if (existingUser) {
            const userResponse = UserMapper.toResponseDTO(existingUser);

            const accessToken = this._tokenService.generateAccessToken({ id: existingUser.clientId, email: existingUser.email, role: existingUser.role });
            const refreshToken = this._tokenService.generateRefreshToken({ id: existingUser.clientId, email: existingUser.email, role: existingUser.role });

            return {
                user: userResponse,
                accessToken,
                refreshToken
            }
        }
        const clientId = await this._userIdGenerator.create();

        const newClient = await this._clientRepository.create({
            clientId: clientId,
            name: userData.user_name,
            email: userData.email_address,
            passwordhash: "",
            phone: userData.phone_number,
            role: userData.user_role,
            isBlocked: false,
            loginMethod:LoginMethod.GOOGLE,
            profilePictureUrl: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLoginAt: new Date(0),
        })

        const userResponse = UserMapper.toResponseDTO(newClient);

        const accessToken = this._tokenService.generateAccessToken({
            id: userResponse.user_id,
            email: userResponse.email_address,
            role: userResponse.user_role,
        });

        const refreshToken = this._tokenService.generateRefreshToken({
            id: userResponse.user_id,
            email: userResponse.email_address,
            role: userResponse.user_role,
        });

        return { user: userResponse, accessToken, refreshToken };
    }
}