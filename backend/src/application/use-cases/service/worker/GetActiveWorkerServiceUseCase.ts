import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetActiveWorkerServiceUseCase } from "../../../interfaces/service/worker/IGetActiveWorkerServiceUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";

export class GetActiveWorkerServiceUseCase implements IGetActiveWorkerServiceUseCase {

    constructor(
        private readonly _serviceRepo: IServiceRepository
    ) {}

    async execute(workerId: string) {

        const service = await this._serviceRepo.findActiveByWorkerId(workerId);

        if (!service) return null;

        return ServiceMapper.toResponse(service);
    }
}