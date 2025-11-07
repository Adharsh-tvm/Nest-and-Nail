// src/application/use-cases/RegisterClientUseCase.ts
import { IRegisterClientUseCase } from "../interfaces/IRegisterClientUseCase";
import { IPasswordHasher } from "../services/IPasswordHasher";
import { IGenerateUserID } from "../services/IGenerateUserID";
import { ITokenService } from "../services/ITokenService";
import { UserRequestDTO, UserResponseDTO } from "../dtos/UserDTO";
import { UserMapper } from "../mappers/UserMapper";
import { UserAlreadyExistsError } from "../../domain/errors/DomainError";
import { IClientRepository } from "../../domain/repositories/ICustomerRepository";
import { LoginMethod } from "../../shared/enums/enums";

export class RegisterClientUseCase implements IRegisterClientUseCase {
  constructor(
    private readonly _clientRepository: IClientRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _userIdGenerator: IGenerateUserID,
    private readonly _tokenService: ITokenService
  ) { }

  async execute(
    userData: UserRequestDTO
  ): Promise<{ user: UserResponseDTO; accessToken: string; refreshToken: string }> {
    const existingUser = await this._clientRepository.findByEmail(userData.email_address);
    if (existingUser) {
      throw new UserAlreadyExistsError()
    }

    const hashedPassword = await this._passwordHasher.hash(userData.password);
    const clientId = await this._userIdGenerator.create();

    const newClient = await this._clientRepository.create({
      clientId: clientId,
      name: userData.user_name,
      email: userData.email_address,
      passwordhash: hashedPassword,
      phone: userData.phone_number,
      role: userData.user_role,
      isBlocked: false,
      loginMethod:LoginMethod.EMAIL_PASSWORD,
      profilePictureUrl: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(0),
    });

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
