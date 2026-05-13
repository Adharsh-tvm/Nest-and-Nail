import { UserNotFoundError } from "../../../domain/errors/DomainError";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { ILogger } from "../../../infrastructure/logger/ILogger";
import { Role } from "../../../shared/enums/authEnums";
import { IPasswordHasher } from "../../contracts/IPasswordHasher";
import { IChangePasswordUseCase } from "../../interfaces/auth/IChangePasswordUseCase";
import { AuthValidator } from "../../validators/AuthValidator";

export class ChangePasswordUseCase implements IChangePasswordUseCase {

  constructor(
    private readonly _userRepoFactory: IUserRepositoryFactory,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _logger?: ILogger
  ) { }

  async execute(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {

    const roles = [Role.CLIENT, Role.WORKER, Role.ADMIN];

    let user = null;
    let repoUsed = null;

    for (const role of roles) {
      const repo = this._userRepoFactory.getRepository(role);
      const foundUser = await repo.findById(userId);

      if (foundUser) {
        user = foundUser;
        repoUsed = repo;
        break;
      }
    }

    if (!user || !repoUsed) {
      throw new UserNotFoundError();
    }

    if (!user.passwordhash) {
      throw new Error("Password not set for this account");
    }

    const isMatch = await this._passwordHasher.compare(
      currentPassword,
      user.passwordhash
    );

    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    if (currentPassword === newPassword) {
      throw new Error("New password must be different");
    }

    AuthValidator.validatePassword(newPassword);

    const hashedPassword = await this._passwordHasher.hash(newPassword);

    await repoUsed.updateById(userId, {
      passwordhash: hashedPassword
    });

    this._logger?.info(`Password changed for user ${userId}`);
  }
}