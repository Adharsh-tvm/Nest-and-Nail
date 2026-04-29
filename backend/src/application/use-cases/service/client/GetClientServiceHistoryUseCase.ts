import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { ServiceMapper } from "../../../mappers/ServiceMapper";
import { IGetClientServiceHistoryUseCase } from "../../../interfaces/service/client/IGetClientServiceHistoryUseCase";
import { ServiceStatus } from "../../../../shared/enums/serviceEnums";

export class GetClientServiceHistoryUseCase implements IGetClientServiceHistoryUseCase {
  constructor(
    private readonly _serviceRepo: IServiceRepository
  ) { }

  async execute(clientId: string) {
    const services = await this._serviceRepo.findByClientId(clientId);

    const filtered = services.filter(
      s => s.category !== "VIDEO_CALL" && s.status !== ServiceStatus.PENDING
    );

    return filtered.map(ServiceMapper.toResponse);
  }
}