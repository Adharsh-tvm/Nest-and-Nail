import { Role } from "../../domain/enums/enums";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { User } from "../../domain/entities/User";
import { ClientRepository } from "./ClientRepository";
import { WorkerRepository } from "./WorkerRepository";
import { AdminRepository } from "./AdminRepository";

export class UserRepositoryFactory {
    private readonly _clientRepository: ClientRepository;
    private readonly _workerRepository: WorkerRepository;
    private readonly _adminRepository: AdminRepository;

    constructor() {
        this._clientRepository = new ClientRepository();
        this._workerRepository = new WorkerRepository();
        this._adminRepository = new AdminRepository();
    }

    getRepository<T extends User>(role: Role): IBaseRepository<T> {
        switch (role) {
            case Role.CLIENT:
                return this._clientRepository as unknown as IBaseRepository<T>;
            case Role.WORKER:
                return this._workerRepository as unknown as IBaseRepository<T>;
            case Role.ADMIN:
                return this._adminRepository as unknown as IBaseRepository<T>;
            default:
                throw new Error(`Unknown role: ${role}`);
        }
    }
}