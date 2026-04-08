import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { AdminServiceResponseDTO } from "../../../dtos/ServiceDTO";
import { IGetAllServicesUseCase } from "../../../interfaces/service/admin/IGetAllServicesUseCase";


export class GetAllServicesUseCase implements IGetAllServicesUseCase {

    constructor(
        private readonly serviceRepo: IServiceRepository
    ) {}

    async execute(): Promise<AdminServiceResponseDTO[]> {

        const services = await this.serviceRepo.findAllWithDetails();

        return services;
    }
}