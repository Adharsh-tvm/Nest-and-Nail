import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetServiceDetailsForAdminUseCase } from "../../../interfaces/service/admin/IGetServiceDetailsForAdminUseCase";


export class GetServiceDetailsForAdminUseCase implements IGetServiceDetailsForAdminUseCase {

    constructor(
        private readonly _serviceRepo: IServiceRepository
    ) {}

    async execute(serviceId: string) {

        const service = await this._serviceRepo.findDetailedByServiceId(serviceId);

        if (!service) {
            throw new Error("Service not found");
        }

        return service;
    }
}