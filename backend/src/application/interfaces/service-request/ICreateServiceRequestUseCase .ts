import { ServiceRequest } from "../../../domain/entities/ServiceRequest";
import { CreateServiceRequestDTO } from "../../dtos/ServiceRequestDTO";

export interface ICreateServiceRequestUseCase {
    execute(
        data: CreateServiceRequestDTO & { clientId: string }
    ): Promise<ServiceRequest>;
}