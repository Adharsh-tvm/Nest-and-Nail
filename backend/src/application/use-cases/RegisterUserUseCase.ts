import { IRegisterUserUseCase } from "../interfaces/IRegisterUserUseCase";
import { IPasswordHasher } from "../services/IPasswordHasher";
import { IGenerateUserID } from "../services/IGenerateUserID";
import { ITokenService } from "../services/ITokenService";
import { UserRequestDTO, UserResponseDTO } from "../dtos/UserDTO";
import { UserMapper } from "../mappers/UserMapper";
import { UserAlreadyExistsError } from "../../domain/errors/DomainError";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { User } from "../../domain/entities/User";
import { LoginMethod, Role } from "../../shared/enums/enums";
import { ILogger } from "../interfaces/ILogger";

export class RegisterUserUseCase<T extends User> implements IRegisterUserUseCase {
  constructor(
    private readonly _userRepository: IBaseRepository<T>,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _userIdGenerator: IGenerateUserID,
    private readonly _tokenService: ITokenService,
    private readonly _logger: ILogger
  ) {}

  async execute(
    userData: UserRequestDTO
  ): Promise<{ user: UserResponseDTO; accessToken: string; refreshToken: string }> {
    this._logger.info(`[RegisterUserUseCase] Registration attempt for ${userData.email_address} as ${userData.user_role}`);

    const existingUser = await this._userRepository.findByEmail(userData.email_address);
    if (existingUser) {
      this._logger.warn(`[RegisterUserUseCase] User already exists: ${userData.email_address}`);
      throw new UserAlreadyExistsError();
    }

    this._logger.info(`[RegisterUserUseCase] Hashing password`);
    const hashedPassword = await this._passwordHasher.hash(userData.password);
    const userId = await this._userIdGenerator.create();

    this._logger.info(`[RegisterUserUseCase] Creating user with ID: ${userId}`);

    const role = userData.user_role.toLowerCase() as Role;

    const newUser = await this._userRepository.create({
      userId: userId,
      name: userData.user_name,
      email: userData.email_address,
      passwordhash: hashedPassword,
      phone: userData.phone_number,
      role,
      isBlocked: false,
      loginMethod: LoginMethod.EMAIL_PASSWORD,
      profilePictureUrl: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
    } as T);

    this._logger.info(`[RegisterUserUseCase] User created: ${JSON.stringify(newUser)}`);

    const userResponse = UserMapper.toResponseDTO(newUser);
    
    this._logger.info(`[RegisterUserUseCase] User response mapped: ${JSON.stringify(userResponse)}`);

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

    this._logger.info(`[RegisterUserUseCase] Tokens generated successfully`);

    return { user: userResponse, accessToken, refreshToken };
  }
}