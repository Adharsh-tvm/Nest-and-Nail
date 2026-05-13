import { WorkerSchedule } from "../../domain/entities/WorkerSchedule";
import { WorkerScheduleDTO } from "../dtos/WorkerScheduleDTO";

export class WorkerScheduleMapper {
  static toDTO(entity: WorkerSchedule): WorkerScheduleDTO {
    return {
      id: entity.id,
      workerId: entity.workerId,
      date: entity.date,
      slotType: entity.slotType,
      isBooked: entity.isBooked,
      isAvailable: entity.isAvailable,
      serviceId: entity.serviceId,
    };
  }

  static toDomain(dto: WorkerScheduleDTO): WorkerSchedule {
    return {
      id: dto.id,
      workerId: dto.workerId,
      date: dto.date,
      slotType: dto.slotType,
      isBooked: dto.isBooked,
      isAvailable: dto.isAvailable,
      serviceId: dto.serviceId,
    };
  }
}
