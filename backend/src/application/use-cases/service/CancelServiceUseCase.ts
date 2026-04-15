import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IWorkerScheduleRepository } from "../../../domain/repositories/IWorkerScheduleRepository";
import { ICancelServiceUseCase } from "../../interfaces/service/ICancelServiceUseCase";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";
import { ServiceMapper } from "../../mappers/ServiceMapper";
import { ServiceResponseDTO } from "../../dtos/ServiceDTO";

export class CancelServiceUseCase implements ICancelServiceUseCase {

    constructor(
        private readonly _serviceRepo: IServiceRepository,
        private readonly _scheduleRepo: IWorkerScheduleRepository
    ) { }

    async execute(serviceId: string, userId: string, reason?: string): Promise<ServiceResponseDTO> {

        const service = await this._serviceRepo.findById(serviceId);

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

        const now = new Date();
        const createdAt = new Date(service.createdAt);

        const diffInMs = now.getTime() - createdAt.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (diffInHours > 6) {
            throw new Error("Cannot cancel service after 6 hours");
        }

        const updated = await this._serviceRepo.updateStatus(serviceId, {
            status: ServiceStatus.CANCELLED,
            cancelledAt: now,
            updatedAt: new Date()
        });

        if (!updated) {
            throw new Error("Failed to cancel service");
        }

        for (const slot of service.selectedSlots) {
            await this._scheduleRepo.unmarkAsBooked(
                service.workerId,
                slot.date,
                slot.slotType
            );
        }

        return ServiceMapper.toResponse(updated);
    }
}