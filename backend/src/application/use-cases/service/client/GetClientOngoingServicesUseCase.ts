import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetClientOngoingServicesUseCase } from "../../../interfaces/service/client/IGetClientOngoingServicesUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";
import { ServiceStatus } from "../../../../shared/enums/serviceEnums";

export class GetClientOngoingServicesUseCase implements IGetClientOngoingServicesUseCase {
  constructor(
    private readonly _serviceRepo: IServiceRepository
  ) {}

  async execute(clientId: string) {
    const services = await this._serviceRepo.findByClientId(clientId);

    const ongoing = services.filter(
      s => s.category !== "VIDEO_CALL" &&
        s.status !== ServiceStatus.PENDING &&
        (
          s.status === ServiceStatus.CONFIRMED ||
          s.status === ServiceStatus.IN_PROGRESS
        )
    );

    return ongoing.map(ServiceMapper.toResponse);
  }
}