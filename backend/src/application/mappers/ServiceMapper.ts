import { Service } from "../../domain/entities/Service";
import { ServiceStatus } from "../../shared/enums/serviceEnums";
import { PaymentStatus } from "../../shared/enums/paymentStatus";
import { v4 as uuidv4 } from "uuid";
import { CreateServiceDTO, ServiceResponseDTO } from "../dtos/ServiceDTO";

export class ServiceMapper {

  static toEntity(dto: CreateServiceDTO): Service {
    return {
      id: uuidv4(),
      serviceId: uuidv4(),

      clientId: dto.clientId,
      workerId: dto.workerId,

      category: dto.category,

      title: dto.title || "Service Booking",
      description: dto.description || "Service booked by client",

      location: dto.location,

      scheduledDate: dto.scheduledDate,
      selectedSlots: dto.selectedSlots,

      numberOfDays: dto.numberOfDays || 1,

      status: ServiceStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PENDING,

      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static toResponse(service: Service): ServiceResponseDTO {
    return {
      serviceId: service.serviceId,
      clientId: service.clientId,
      workerId: service.workerId,
      category: service.category,
      scheduledDate: service.scheduledDate,
      selectedSlots: service.selectedSlots,
      status: service.status,
      paymentStatus: service.paymentStatus,
      createdAt: service.createdAt
    };
  }
}