import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetWorkerServiceDetailsUseCase } from "../../../interfaces/service/worker/IGetWorkerServiceDetailsUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";

export class GetWorkerServiceDetailsUseCase implements IGetWorkerServiceDetailsUseCase {

    constructor(
        private readonly serviceRepo: IServiceRepository
    ) {}

    async execute(serviceId: string, workerId: string) {

        const service = await this.serviceRepo.findById(serviceId);

        if (!service) {
            throw new Error("Service not found");
        }

        if (service.workerId !== workerId) {
            throw new Error("Unauthorized access to service");
        }

        return ServiceMapper.toResponse(service);
    }
}