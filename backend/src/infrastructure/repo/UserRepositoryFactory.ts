import { Role } from "../../shared/enums/enums";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { User } from "../../domain/entities/User";
import { ClientRepository } from "./ClientRepository";
import { WorkerRepository } from "./WorkerRepository";
import { Client } from "../../domain/entities/Client";
import { Worker } from "../../domain/entities/Worker";

export class UserRepositoryFactory {
    private clientRepository: ClientRepository;
    private workerRepository: WorkerRepository;

    constructor() {
        this.clientRepository = new ClientRepository();
        this.workerRepository = new WorkerRepository();
    }

    getRepository<T extends User>(role: Role): IBaseRepository<T> {
        switch (role) {
            case Role.CLIENT:
                return this.clientRepository as unknown as IBaseRepository<T>;
            case Role.WORKER:
                return this.workerRepository as unknown as IBaseRepository<T>;
            case Role.ADMIN:
                // You can add AdminRepository when needed
                throw new Error("Admin repository not implemented yet");
            default:
                throw new Error(`Unknown role: ${role}`);
        }
    }
}