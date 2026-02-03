import { ServiceRequest } from "../../../domain/entities/ServiceRequest";

export interface ICreateServiceRequestUseCase {
    execute(
        data: Omit<
            ServiceRequest,
            | "id"
            | "requestId"
            | "status"
            | "reservedBy"
            | "reservationExpiresAt"
            | "createdAt"
            | "updatedAt"
        >
    ): Promise<ServiceRequest>;
}