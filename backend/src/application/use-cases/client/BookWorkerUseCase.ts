import { CreateServiceDTO, ServiceResponseDTO } from "../../dtos/ServiceDTO";
import { ServiceMapper } from "../../mappers/ServiceMapper";
import { IBookWorkerUseCase } from "../../../domain/repositories/IBookWorkerUseCase";
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { IWorkerScheduleRepository } from "../../../domain/repositories/IWorkerScheduleRepository";



export class BookWorkerUseCase implements IBookWorkerUseCase {

  constructor(
    private readonly _serviceRepo: IServiceRepository,
    private readonly _workerRepo: IWorkerRepository,
    private readonly _scheduleRepo: IWorkerScheduleRepository
  ) { }

  async execute(dto: CreateServiceDTO): Promise<ServiceResponseDTO> {

    if (dto.category === "VIDEO_CALL") {

      if (dto.selectedSlots.length !== 1) {
        throw new Error("Video call requires exactly one slot");
      }

      const slot = dto.selectedSlots[0];

      if (!slot.slotType.toString().includes("VIDEO")) {
        throw new Error("Invalid slot for video call");
      }

      if (dto.numberOfWorkers !== 1) {
        throw new Error("Only one worker allowed for video call");
      }

      if (dto.numberOfDays && dto.numberOfDays > 1) {
        throw new Error("Video call cannot span multiple days");
      }
    }

    const worker = await this._workerRepo.findById(dto.workerId);
    if (!worker) throw new Error("Worker not found");

    if (!dto.numberOfWorkers || dto.numberOfWorkers < 1) {
      dto.numberOfWorkers = 1; // fallback
    }

    const now = new Date();
    const twelveHoursFromNow = now.getTime() + 12 * 60 * 60 * 1000;

    for (const slot of dto.selectedSlots) {
      const slotDate = new Date(slot.date);
      let startHour = 9;
      let startMinute = 0;
      if (slot.slotType === "EVENING_HALF") {
        startHour = 14; // 2 PM
      } else if (slot.slotType.toString().startsWith("VIDEO_")) {
        // e.g. VIDEO_8_00_8_15
        const parts = slot.slotType.toString().split("_");
        if (parts.length >= 3) {
          startHour = parseInt(parts[1], 10);
          startMinute = parseInt(parts[2], 10);
        }
      }

      slotDate.setUTCHours(startHour, startMinute, 0, 0);

      if (slotDate.getTime() < twelveHoursFromNow) {
        throw new Error("Services must be booked at least 12 hours in advance.");
      }
    }

    for (const slot of dto.selectedSlots) {
      const existing = await this._scheduleRepo.findByWorkerDateAndSlot(
        dto.workerId,
        slot.date,
        slot.slotType
      );

      if (existing) {
        if (!existing.isAvailable) {
          throw new Error(`Worker is unavailable on ${slot.date.toISOString().split('T')[0]}`);
        }
        if (existing.isBooked) {
          throw new Error(`Slot already booked for date: ${slot.date.toISOString().split('T')[0]}`);
        }
      }
    }

    const existing = await this._serviceRepo.findActiveByWorkerId(dto.workerId);

    if (existing) {
      throw new Error("Worker already has an active service");
    }

    const serviceEntity = ServiceMapper.toEntity(dto);

    const created = await this._serviceRepo.create(serviceEntity);

    // NOTE: Worker schedule slots are NOT marked as booked here.
    // They will be marked as booked only after payment succeeds
    // in VerifyPaymentUseCase (Razorpay) or ProcessWalletPaymentUseCase (Wallet).
    // Notification to worker is also deferred until payment is confirmed.

    return ServiceMapper.toResponse(created);
  }
}