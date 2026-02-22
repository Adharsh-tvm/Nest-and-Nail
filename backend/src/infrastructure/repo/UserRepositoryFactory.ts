import { Role } from "../../shared/enums/authEnums";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { User } from "../../domain/entities/User";
import { IUserRepositoryFactory } from "../../domain/repositories/IUserRepositoryFactory";
import { Client } from "../../domain/entities/Client";
import { Worker } from "../../domain/entities/Worker";
import { Admin } from "../../domain/entities/Admin";

export class UserRepositoryFactory implements IUserRepositoryFactory {

  constructor(
    private readonly _clientRepository: IBaseRepository<Client>,
    private readonly _workerRepository: IBaseRepository<Worker>,
    private readonly _adminRepository: IBaseRepository<Admin>,
    private readonly _userRepository: IBaseRepository<User>
  ) { }

  getRepository<T extends User>(role: Role): IBaseRepository<T> {
    switch (role) {
      case Role.CLIENT:
        return this._clientRepository as IBaseRepository<T>;
      case Role.WORKER:
        return this._workerRepository as IBaseRepository<T>;
      case Role.ADMIN:
        return this._adminRepository as IBaseRepository<T>;
      case 'USER' as any: // Special case for all users
        return this._userRepository as IBaseRepository<T>;
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }
}
