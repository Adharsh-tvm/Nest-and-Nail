import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { ServiceMapper } from "../../../mappers/ServiceMapper";
import { IGetClientServiceHistoryUseCase } from "../../../interfaces/service/client/IGetClientServiceHistoryUseCase";

export class GetClientServiceHistoryUseCase implements IGetClientServiceHistoryUseCase {
  constructor(
    private readonly serviceRepo: IServiceRepository
  ) { }

  async execute(clientId: string) {
    const services = await this.serviceRepo.findByClientId(clientId);

    const filtered = services.filter(
      s => s.category !== "VIDEO_CALL"
    );

    return filtered.map(ServiceMapper.toResponse);
  }
}