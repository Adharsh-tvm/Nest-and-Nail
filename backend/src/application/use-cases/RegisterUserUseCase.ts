import { UserAlreadyExistsError } from "../../domain/errors/DomainError";
import { UserRepositoryFactory } from "../../infrastructure/repo/UserRepositoryFactory";
import { LoginMethod } from "../../shared/enums/enums";
import { UserRequestDTO, UserResponseDTO } from "../dtos/UserDTO";
import { ILogger } from "../interfaces/ILogger";
import { IRegisterUserUseCase } from "../interfaces/IRegisterUserUseCase";
import { UserMapper } from "../mappers/UserMapper";
import { IGenerateUserID } from "../services/IGenerateUserID";
import { IPasswordHasher } from "../services/IPasswordHasher";
import { ITokenService } from "../services/ITokenService";

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly _repositoryFactory: UserRepositoryFactory,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _userIdGenerator: IGenerateUserID,
    private readonly _tokenService: ITokenService,
    private readonly _logger: ILogger
  ) { }

  async execute(
    userData: UserRequestDTO
  ): Promise<{ user: UserResponseDTO; accessToken: string; refreshToken: string }> {
    console.log(`[RegisterUserUseCase] DEBUG - Received password: "${userData.password}"`);
    console.log(`[RegisterUserUseCase] DEBUG - Password length: ${userData.password.length}`);

    this._logger.info(`[RegisterUserUseCase] Registration attempt for ${userData.email_address} as ${userData.user_role}`);

    const repository = this._repositoryFactory.getRepository(userData.user_role);

    const existingUser = await repository.findByEmail(userData.email_address);
    if (existingUser) {
      this._logger.warn(`[RegisterUserUseCase] User already exists: ${userData.email_address}`);
      throw new UserAlreadyExistsError();
    }

    this._logger.info(`[RegisterUserUseCase] Hashing password`);
    console.log(`[RegisterUserUseCase] DEBUG - About to hash password`);

    const hashedPassword = await this._passwordHasher.hash(userData.password);

    console.log(`[RegisterUserUseCase] DEBUG - Password hashed successfully`);
    console.log(`[RegisterUserUseCase] DEBUG - Hashed password: "${hashedPassword}"`);
    console.log(`[RegisterUserUseCase] DEBUG - Hashed password length: ${hashedPassword.length}`);

    const userId = await this._userIdGenerator.create();

    this._logger.info(`[RegisterUserUseCase] Creating user with ID: ${userId}`);

    const newUser = await repository.create({
      userId: userId,
      name: userData.user_name,
      email: userData.email_address,
      passwordhash: hashedPassword,
      phone: userData.phone_number,
      role: userData.user_role,
      isBlocked: false,
      loginMethod: LoginMethod.EMAIL_PASSWORD,
      profilePictureUrl: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
    } as any);

    console.log(`[RegisterUserUseCase] DEBUG - User created in DB`);
    console.log(`[RegisterUserUseCase] DEBUG - User ID: ${newUser.userId}`);
    console.log(`[RegisterUserUseCase] DEBUG - Stored hash: "${newUser.passwordhash}"`);

    this._logger.info(`[RegisterUserUseCase] User created successfully`);

    const userResponse = UserMapper.toResponseDTO(newUser);

    const accessToken = this._tokenService.generateAccessToken({
      id: userResponse.user_id,
      name: userResponse.user_name,           
      email: userResponse.email_address,      
      role: userResponse.user_role,           
    });
    const refreshToken = this._tokenService.generateRefreshToken({
      id: userResponse.user_id,
      name: userResponse.user_name,
      email: userResponse.email_address,
      role: userResponse.user_role,
    });


    this._logger.info(`[RegisterUserUseCase] Tokens generated successfully`);

    return { user: userResponse, accessToken, refreshToken };
  }
}