import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { ServiceMapper } from "../../../mappers/ServiceMapper";
import { IGetClientServiceHistoryUseCase } from "../../../interfaces/service/client/IGetClientServiceHistoryUseCase";

export class GetClientServiceHistoryUseCase implements IGetClientServiceHistoryUseCase {
  constructor(
    private readonly serviceRepo: IServiceRepository
  ) { }

  async execute(clientId: string) {
    const services = await this.serviceRepo.findByClientId(clientId);

    return services.map(ServiceMapper.toResponse);
  }
}