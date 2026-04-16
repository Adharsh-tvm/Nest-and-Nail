import { Service } from "../../domain/entities/Service";
import { ServiceStatus } from "../../shared/enums/serviceEnums";
import { PaymentStatus } from "../../shared/enums/paymentEnums";
import { v4 as uuidv4 } from "uuid";
import { CreateServiceDTO, ServiceResponseDTO } from "../dtos/ServiceDTO";
import { getVideoSlotTime } from "../../utils/getVideoSlotTime";

export class ServiceMapper {

  static toEntity(dto: CreateServiceDTO): Service {
    const totalAmount = dto.pricePerWorker * dto.numberOfWorkers;

    let videoCall;

    if (dto.category === "VIDEO_CALL") {
      const slot = dto.selectedSlots[0];

      const { start, end } = getVideoSlotTime(
        slot.slotType,
        slot.date
      );

      videoCall = {
        roomId: `room_${uuidv4()}`,
        startTime: start,
        endTime: end
      };
    }


    return {
      id: uuidv4(),
      serviceId: uuidv4(),

      clientId: dto.clientId,
      workerId: dto.workerId,

      category: dto.category,

      title: dto.title || "Service Booking",
      description: dto.description || "Service booked by client",

      location: dto.location,
      address: dto.address,

      scheduledDate: dto.scheduledDate,
      selectedSlots: dto.selectedSlots,

      numberOfDays: dto.numberOfDays || 1,
      numberOfWorkers: dto.numberOfWorkers,

      pricePerWorker: dto.pricePerWorker,
      totalAmount,

      status: ServiceStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,

      videoCall,

      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static toResponse(service: any): ServiceResponseDTO {
    return {
      serviceId: service.serviceId,
      clientId: service.clientId,
      workerId: service.workerId,
      category: service.category,
      scheduledDate: service.scheduledDate,
      selectedSlots: service.selectedSlots,
      status: service.status,
      pricePerWorker: service.pricePerWorker,
      totalAmount: service.totalAmount,
      paymentStatus: service.paymentStatus,
      createdAt: service.createdAt,
      client: service.client,
      worker: service.worker,
      location: service.location ? {
        type: service.location.type,
        coordinates: service.location.coordinates
      } : undefined,
      address: service.address,
      videoCall: service.videoCall,
    };
  }
}