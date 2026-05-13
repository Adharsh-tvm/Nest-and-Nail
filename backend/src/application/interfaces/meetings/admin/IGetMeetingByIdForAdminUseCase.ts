import { AdminServiceResponseDTO } from "../../../dtos/ServiceDTO";

export interface IGetMeetingByIdForAdminUseCase {
    execute(serviceId: string): Promise<AdminServiceResponseDTO>;
}