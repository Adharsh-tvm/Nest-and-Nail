import { AdminServiceResponseDTO } from "../../../dtos/ServiceDTO";

export interface IGetAllMeetingsForAdminUseCase {
    execute(query: any): Promise<AdminServiceResponseDTO[]>;
}