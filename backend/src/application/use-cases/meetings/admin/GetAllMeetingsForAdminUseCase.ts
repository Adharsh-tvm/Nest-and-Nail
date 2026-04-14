import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetAllMeetingsForAdminUseCase } from "../../../interfaces/meetings/admin/IGetAllMeetingsForAdminUseCase";

export class GetAllMeetingsForAdminUseCase
    implements IGetAllMeetingsForAdminUseCase {

    constructor(private serviceRepository: IServiceRepository) { }

    async execute(query: any) {
        return await this.serviceRepository.getAllMeetingsForAdmin(query);
    }
}