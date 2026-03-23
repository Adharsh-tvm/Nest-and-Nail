import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IStartServiceUseCase } from "../../interfaces/service/IStartServiceUseCase";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";
import { ServiceMapper } from "../../mappers/ServiceMapper";

export class StartServiceUseCase implements IStartServiceUseCase {

    constructor(
        private readonly serviceRepo: IServiceRepository
    ) { }

    async execute(serviceId: string, workerId: string) {

        const service = await this.serviceRepo.findById(serviceId);

        if (!service) {
            throw new Error("Service not found");
        }

        // 🔒 Authorization
        if (service.workerId !== workerId) {
            throw new Error("Unauthorized");
        }

        // 🔁 State validation
        if (service.status !== ServiceStatus.CONFIRMED) {
            throw new Error("Service cannot be started");
        }

        const updated = await this.serviceRepo.updateStatus(serviceId, {
            status: ServiceStatus.IN_PROGRESS,
            startedAt: new Date(),
            updatedAt: new Date()
        });

        if (!updated) {
            throw new Error("Failed to start service");
        }

        return ServiceMapper.toResponse(updated);
    }
}