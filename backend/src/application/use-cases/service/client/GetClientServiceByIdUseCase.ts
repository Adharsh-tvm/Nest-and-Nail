import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetClientServiceByIdUseCase } from "../../../interfaces/service/client/IGetClientServiceByIdUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";

export class GetClientServiceByIdUseCase implements IGetClientServiceByIdUseCase {
  constructor(
    private readonly _serviceRepo: IServiceRepository
  ) { }

  async execute(serviceId: string, clientId: string) {
    const service = await this._serviceRepo.findById(serviceId);

    if (!service) {
      throw new Error("Service not found");
    }

    if (service.clientId !== clientId) {
      throw new Error("Unauthorized");
    }

    return ServiceMapper.toResponse(service);
  }
}