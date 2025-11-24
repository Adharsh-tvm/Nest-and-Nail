import { Role } from "../../shared/enums/enums";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { User } from "../../domain/entities/User";
import { ClientRepository } from "./ClientRepository";
import { WorkerRepository } from "./WorkerRepository";
import { AdminRepository } from "./AdminRepository";

export class UserRepositoryFactory {
    private readonly clientRepository: ClientRepository;
    private readonly workerRepository: WorkerRepository;
    private readonly adminRepository: AdminRepository;

    constructor() {
        this.clientRepository = new ClientRepository();
        this.workerRepository = new WorkerRepository();
        this.adminRepository = new AdminRepository();
    }

    getRepository<T extends User>(role: Role): IBaseRepository<T> {
        switch (role) {
            case Role.CLIENT:
                return this.clientRepository as unknown as IBaseRepository<T>;
            case Role.WORKER:
                return this.workerRepository as unknown as IBaseRepository<T>;
            case Role.ADMIN:
                return this.adminRepository as unknown as IBaseRepository<T>;
            default:
                throw new Error(`Unknown role: ${role}`);
        }
    }
}