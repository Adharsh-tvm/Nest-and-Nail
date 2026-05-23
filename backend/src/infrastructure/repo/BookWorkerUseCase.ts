import { CreateServiceDTO, ServiceResponseDTO } from "../../application/dtos/ServiceDTO";
import { ServiceMapper } from "../../application/mappers/ServiceMapper";
import { IBookWorkerUseCase } from "../../domain/repositories/IBookWorkerUseCase";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { IWorkerScheduleRepository } from "../../domain/repositories/IWorkerScheduleRepository";
import { DomainError } from "../../domain/errors/DomainError";



export class BookWorkerUseCase implements IBookWorkerUseCase {

  constructor(
    private readonly serviceRepo: IServiceRepository,
    private readonly workerRepo: IWorkerRepository,
    private readonly scheduleRepo: IWorkerScheduleRepository
  ) { }

  async execute(dto: CreateServiceDTO): Promise<ServiceResponseDTO> {

    // 1. Validate worker
    const worker = await this.workerRepo.findById(dto.workerId);
    if (!worker) throw new Error("Worker not found");

    // 2. Check slots for all selected dates
    for (const slot of dto.selectedSlots) {
      const existing = await this.scheduleRepo.findByWorkerDateAndSlot(
        dto.workerId,
        slot.date,
        slot.slotType
      );

      if (existing?.isBooked) {
        throw new DomainError(
          `Slot already booked for date: ${slot.date.toISOString().split('T')[0]}`,
          "SLOT_LOCKED_OR_BOOKED"
        );
      }
    }

    const existing = await this.serviceRepo.findActiveByWorkerId(dto.workerId);

    if (existing) {
      throw new Error("Worker already has an active service");
    }

    // 3. Map DTO → Entity
    const serviceEntity = ServiceMapper.toEntity(dto);

    // 4. Temporarily lock slots (or mark as booked in this old flow, let's keep lockSlot)
    const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);
    const lockedSlots: typeof dto.selectedSlots = [];
    try {
      for (const slot of dto.selectedSlots) {
        await this.scheduleRepo.lockSlot(
          dto.workerId,
          slot.date,
          slot.slotType,
          tenMinutesFromNow,
          serviceEntity.serviceId
        );
        lockedSlots.push(slot);
      }
    } catch (error) {
      for (const slot of lockedSlots) {
        try {
          await this.scheduleRepo.unlockSlot(dto.workerId, slot.date, slot.slotType);
        } catch (unlockError) {
          console.error("Failed to unlock slot during rollback", unlockError);
        }
      }
      throw error;
    }

    // 5. Save
    const created = await this.serviceRepo.create(serviceEntity);

    // 6. Return DTO
    return ServiceMapper.toResponse(created);
  }
}