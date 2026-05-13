import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { GetAllMeetingsQuery } from "../../../../shared/queries/GetAllMeetingsQuery";
import { IGetAllMeetingsForAdminUseCase } from "../../../interfaces/meetings/admin/IGetAllMeetingsForAdminUseCase";

export class GetAllMeetingsForAdminUseCase
    implements IGetAllMeetingsForAdminUseCase {

    constructor(
        private readonly serviceRepository: IServiceRepository
    ) { }

    async execute(
        query: GetAllMeetingsQuery
    ): Promise<unknown> {

        const formattedQuery = {
            page: query.page ?? 1,
            limit: query.limit ?? 10,
            search: query.search,
            status: query.status,
        };

        return await this.serviceRepository.getAllMeetingsForAdmin(
            formattedQuery
        );
    }
}