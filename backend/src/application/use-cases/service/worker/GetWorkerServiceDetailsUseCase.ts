import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetWorkerServiceDetailsUseCase } from "../../../interfaces/service/worker/IGetWorkerServiceDetailsUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";
import { IUserRepositoryFactory } from "../../../../domain/repositories/IUserRepositoryFactory";
import { S3Service } from "../../../../infrastructure/adapters/S3service";
import { ServiceStatus } from "../../../../shared/enums/serviceEnums";
import { Role } from "../../../../shared/enums/authEnums";

export class GetWorkerServiceDetailsUseCase implements IGetWorkerServiceDetailsUseCase {

    constructor(
        private readonly _serviceRepo: IServiceRepository,
        private readonly _userRepoFactory: IUserRepositoryFactory,
        private readonly _s3Service: S3Service
    ) {}

    async execute(serviceId: string, workerId: string) {

        const service = await this._serviceRepo.findById(serviceId);

        if (!service) {
            throw new Error("Service not found");
        }

        if (service.workerId !== workerId) {
            throw new Error("Unauthorized access to service");
        }

        // A PENDING service has not been paid yet — treat it as non-existent
        if (service.status === ServiceStatus.PENDING) {
            throw new Error("Service not found");
        }

        const userRepo = this._userRepoFactory.getRepository(Role.CLIENT);
        const client = await userRepo.findById(service.clientId);

        const responseDTO = ServiceMapper.toResponse(service);

        let profilePictureUrl = client?.profilePictureUrl;
        if (profilePictureUrl && !profilePictureUrl.startsWith('http')) {
            try {
                profilePictureUrl = await this._s3Service.getPresignedDownloadUrl(profilePictureUrl);
            } catch (err) {
                console.error(`Error generating presigned URL for client ${service.clientId}:`, err);
                profilePictureUrl = undefined;
            }
        }

        return {
            ...responseDTO,
            client: client ? {
                name: client.name,
                email: client.email,
                phone: client.phone,
                profilePictureUrl
            } : undefined,
            location: service.location,
            title: service.title,
            description: service.description,
            numberOfDays: service.numberOfDays,
        };
    }
}