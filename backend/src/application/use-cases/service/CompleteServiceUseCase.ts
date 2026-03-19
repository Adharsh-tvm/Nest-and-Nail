import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { ICompleteServiceUseCase } from "../../interfaces/service/ICompleteServiceUseCase";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";
import { ServiceMapper } from "../../mappers/ServiceMapper";

export class CompleteServiceUseCase implements ICompleteServiceUseCase {

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
        if (service.status !== ServiceStatus.IN_PROGRESS) {
            throw new Error("Service not in progress");
        }

        const updated = await this.serviceRepo.updateStatus(serviceId, {
            status: ServiceStatus.COMPLETED,
            completedAt: new Date(),
            updatedAt: new Date()
        });

        if (!updated) {
            throw new Error("Failed to complete service");
        }

        return ServiceMapper.toResponse(updated);
    }
}