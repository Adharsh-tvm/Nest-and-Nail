import { CreateServiceDTO, ServiceResponseDTO } from "../../application/dtos/ServiceDTO";
import { ServiceMapper } from "../../application/mappers/ServiceMapper";
import { IBookWorkerUseCase } from "../../domain/repositories/IBookWorkerUseCase";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { IWorkerScheduleRepository } from "../../domain/repositories/IWorkerScheduleRepository";



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
        throw new Error(`Slot already booked for date: ${slot.date.toISOString().split('T')[0]}`);
      }
    }

    const existing = await this.serviceRepo.findActiveByWorkerId(dto.workerId);

    if (existing) {
      throw new Error("Worker already has an active service");
    }

    // 3. Map DTO → Entity
    const serviceEntity = ServiceMapper.toEntity(dto);

    // 4. Save
    const created = await this.serviceRepo.create(serviceEntity);

    // 5. Lock slots for all selected dates
    for (const slot of dto.selectedSlots) {
      await this.scheduleRepo.markAsBooked(
        dto.workerId,
        slot.date,
        slot.slotType,
        created.serviceId
      );
    }

    // 6. Return DTO
    return ServiceMapper.toResponse(created);
  }
}