import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { UserResponseDTO } from "../../dtos/UserDTO";
import { IGetAllWorkersUseCase } from "../../interfaces/admin/IGetAllWorkersUseCase";
import { UserMapper } from "../../mappers/UserMapper";

export class GetAllWorkersUseCase implements IGetAllWorkersUseCase {
    constructor(
        private readonly _workerRepoository: IWorkerRepository
    ) { };

    async execute(): Promise<UserResponseDTO[]> {
        const workers = await this._workerRepoository.findAll();

        return workers.map(worker => UserMapper.toResponseDTO(worker));
    }
}