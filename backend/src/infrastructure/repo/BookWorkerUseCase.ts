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

    // 2. Check slot
    const existing = await this.scheduleRepo.findByWorkerDateAndSlot(
      dto.workerId,
      dto.scheduledDate,
      dto.slotType
    );

    if (existing && existing.isBooked) {
      throw new Error("Slot already booked");
    }

    // 3. Map DTO → Entity
    const serviceEntity = ServiceMapper.toEntity(dto);

    // 4. Save
    const created = await this.serviceRepo.create(serviceEntity);

    // 5. Lock slot
    await this.scheduleRepo.markAsBooked(
      dto.workerId,
      dto.scheduledDate,
      dto.slotType,
      created.serviceId
    );

    // 6. Return DTO
    return ServiceMapper.toResponse(created);
  }
}