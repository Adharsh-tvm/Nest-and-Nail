import { AdminServiceResponseDTO } from "../../../dtos/ServiceDTO";
import { GetAllMeetingsQuery } from "../../../../shared/queries/GetAllMeetingsQuery";

export interface IGetAllMeetingsForAdminUseCase {
    execute(
        query: GetAllMeetingsQuery
    ): Promise<unknown>;
}