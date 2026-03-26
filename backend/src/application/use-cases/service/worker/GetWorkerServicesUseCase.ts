import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetWorkerServicesUseCase } from "../../../interfaces/service/worker/IGetWorkerServicesUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";
import { ServiceStatus } from "../../../../shared/enums/serviceEnums";

export class GetWorkerServicesUseCase implements IGetWorkerServicesUseCase {

    constructor(
        private readonly serviceRepo: IServiceRepository
    ) {}

    async execute(workerId: string, status?: ServiceStatus) {

        let services = await this.serviceRepo.findByWorkerId(workerId);

        //Filter by status if provided
        if (status) {
            services = services.filter(s => s.status === status);
        }

        return services.map(ServiceMapper.toResponse);
    }
}