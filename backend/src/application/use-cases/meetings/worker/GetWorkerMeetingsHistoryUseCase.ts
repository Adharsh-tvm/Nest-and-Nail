import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetWorkerScheduledMeetingsUseCase } from "../../../interfaces/meetings/worker/IGetWorkerScheduledMeetingsUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";

export class GetWorkerMeetingsHistoryUseCase implements IGetWorkerScheduledMeetingsUseCase {

  constructor(private serviceRepo: IServiceRepository) { }

  async execute(workerId: string) {

    const services = await this.serviceRepo.getMeetingsByWorker(workerId);

    return services
      .filter(s => !["OPEN", "PENDING", "CONFIRMED", "IN_PROGRESS"].includes(s.status))
      .map(s => ServiceMapper.toResponse(s));
  }
}