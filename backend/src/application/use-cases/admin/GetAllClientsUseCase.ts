import { IClientRepository } from "../../../domain/repositories/IClientRepository";
import { UserResponseDTO } from "../../dtos/UserDTO";
import { IGetAllClientsUseCase } from "../../interfaces/admin/IGetAllClientsUseCase";
import { UserMapper } from "../../mappers/UserMapper";

export class GetAllClientsUseCase implements IGetAllClientsUseCase {
    constructor(
        private readonly _clientRepository: IClientRepository
    ) { };

    async execute(): Promise<UserResponseDTO[]> {
        const clients = await this._clientRepository.findAll();

        return clients.map(client => UserMapper.toResponseDTO(client));
    }
}