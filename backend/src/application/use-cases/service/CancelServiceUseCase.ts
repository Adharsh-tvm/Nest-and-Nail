import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IWorkerScheduleRepository } from "../../../domain/repositories/IWorkerScheduleRepository";
import { ICancelServiceUseCase } from "../../interfaces/service/ICancelServiceUseCase";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";
import { ServiceMapper } from "../../mappers/ServiceMapper";

export class CancelServiceUseCase implements ICancelServiceUseCase {

    constructor(
        private readonly serviceRepo: IServiceRepository,
        private readonly scheduleRepo: IWorkerScheduleRepository
    ) { }

    async execute(serviceId: string, userId: string) {

        const service = await this.serviceRepo.findById(serviceId);

        if (!service) {
            throw new Error("Service not found");
        }

        // 🔒 Authorization
        if (service.clientId !== userId && service.workerId !== userId) {
            throw new Error("Unauthorized");
        }

        // ❌ Cannot cancel completed
        if (service.status === ServiceStatus.COMPLETED) {
            throw new Error("Cannot cancel completed service");
        }

        const updated = await this.serviceRepo.updateStatus(serviceId, {
            status: ServiceStatus.CANCELLED,
            cancelledAt: new Date(),
            updatedAt: new Date()
        });

        if (!updated) {
            throw new Error("Failed to cancel service");
        }

        for (const slot of service.selectedSlots) {
            await this.scheduleRepo.unmarkAsBooked(
                service.workerId,
                slot.date,
                slot.slotType
            );
        }

        return ServiceMapper.toResponse(updated);
    }
}