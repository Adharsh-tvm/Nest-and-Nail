import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetWorkerScheduledMeetingsUseCase } from "../../../interfaces/meetings/worker/IGetWorkerScheduledMeetingsUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";

export class GetWorkerScheduledMeetingsUseCase implements IGetWorkerScheduledMeetingsUseCase {

    constructor(private serviceRepo: IServiceRepository) { }

    async execute(workerId: string) {

        const services = await this.serviceRepo.getMeetingsByWorker(workerId);

        const filtered = services
            .filter(s => ["CONFIRMED", "IN_PROGRESS"].includes(s.status))
            .map(s => ServiceMapper.toResponse(s));
        
        return filtered
    }
}