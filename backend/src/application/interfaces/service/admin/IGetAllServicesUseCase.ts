import { AdminServiceResponseDTO } from "../../../dtos/ServiceDTO";

export interface IGetAllServicesUseCase {
    execute(): Promise<AdminServiceResponseDTO[]>;
}