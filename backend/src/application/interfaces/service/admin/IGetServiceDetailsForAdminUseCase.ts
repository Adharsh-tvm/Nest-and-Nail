import { AdminServiceResponseDTO } from "../../../dtos/ServiceDTO";


export interface IGetServiceDetailsForAdminUseCase {
    execute(serviceId: string): Promise<AdminServiceResponseDTO>;
}