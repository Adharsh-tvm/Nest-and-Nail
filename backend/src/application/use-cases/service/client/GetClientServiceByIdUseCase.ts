import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetClientServiceByIdUseCase } from "../../../interfaces/service/client/IGetClientServiceByIdUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";
import { ServiceStatus } from "../../../../shared/enums/serviceEnums";

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

    // A PENDING service has not been paid yet — treat it as non-existent
    if (service.status === ServiceStatus.PENDING) {
      throw new Error("Service not found");
    }

    return ServiceMapper.toResponse(service);
  }
}