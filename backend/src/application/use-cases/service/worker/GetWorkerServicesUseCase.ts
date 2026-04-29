import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetWorkerServicesUseCase } from "../../../interfaces/service/worker/IGetWorkerServicesUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";
import { ServiceStatus } from "../../../../shared/enums/serviceEnums";

export class GetWorkerServicesUseCase implements IGetWorkerServicesUseCase {

  constructor(
    private readonly _serviceRepo: IServiceRepository
  ) {}

  async execute(workerId: string, status?: ServiceStatus) {

    let services = await this._serviceRepo.findByWorkerId(workerId);

    console.log("workerId :", workerId);

    services = services.filter(s => s.category !== "VIDEO_CALL" && s.status !== ServiceStatus.PENDING);

    if (status) {
      services = services.filter(s => s.status === status);
    }

    return services.map(ServiceMapper.toResponse);
  }
}