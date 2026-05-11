import { IConcernRepository } from "../../../domain/repositories/IConcernRepository";
import { Concern } from "../../../domain/entities/Concern";
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { IGetAllConcernsUseCase } from "../../interfaces/concern/IGetAllConcernsUseCase";
import { Role } from "../../../shared/enums/authEnums";
import { S3Service } from "../../../infrastructure/adapters/S3service";
import { ConcernModel } from "../../../infrastructure/database/models/ConcernModel";

export class GetAllConcernsUseCase implements IGetAllConcernsUseCase {
  constructor(
    private readonly _concernRepo: IConcernRepository,
    private readonly _serviceRepo: IServiceRepository,
    private readonly _userRepositoryFactory: IUserRepositoryFactory,
    private readonly _s3Service: S3Service
  ) {}

  async execute(query: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { concerns, total, totalPages } = await this._concernRepo.findAll({
      status: query.status,
      search: query.search,
      page,
      limit,
    });

    const populatedConcerns = await Promise.all(
      concerns.map(async (concern) => {
        const concernObj = ((concern as unknown as { toObject?: () => object }).toObject ? (concern as unknown as { toObject: () => object }).toObject() : { ...concern }) as Concern;

        // Fetch Service details
        const service = await this._serviceRepo.findById(concern.serviceId);

        let clientName = "";
        let clientEmail = "";
        let workerName = "";
        let workerEmail = "";
        let raisedByName = "";
        let raisedByEmail = "";
        let serviceName = "";
        let serviceDescription = "";
        let serviceScheduledDate = undefined;
        let serviceAmount = undefined;

        let workerId = "";
        let workerIsSuspended = false;
        let workerSuspensionEndDate = undefined;

        let clientId = "";
        let clientIsSuspended = false;
        let clientSuspensionEndDate = undefined;

        let workerConcernCount = 0;
        let clientConcernCount = 0;

        if (service) {
          serviceName = service.title;
          serviceDescription = service.description;
          serviceScheduledDate = service.scheduledDate;
          serviceAmount = service.totalAmount;
          workerId = service.workerId;
          clientId = service.clientId;

          // Fetch Client details
          try {
            const client = await this._userRepositoryFactory
              .getRepository(Role.CLIENT)
              .findById(service.clientId);
            if (client) {
              clientName = client.name;
              clientEmail = client.email;
              clientIsSuspended = client.isSuspended ?? false;
              clientSuspensionEndDate = client.suspensionEndDate;
            }
          } catch (e) {
            console.error("Error fetching client details in GetAllConcernsUseCase", e);
          }

          // Fetch Worker details
          try {
            const worker = await this._userRepositoryFactory
              .getRepository(Role.WORKER)
              .findById(service.workerId);
            if (worker) {
              workerName = worker.name;
              workerEmail = worker.email;
              workerIsSuspended = worker.isSuspended ?? false;
              workerSuspensionEndDate = worker.suspensionEndDate;
            }
          } catch (e) {
            console.error("Error fetching worker details in GetAllConcernsUseCase", e);
          }

          // Calculate concern counts against the worker
          try {
            const workerServices = await this._serviceRepo.findByWorkerId(service.workerId);
            const workerServiceIds = workerServices.map(s => s.serviceId);
            workerConcernCount = await ConcernModel.countDocuments({
              serviceId: { $in: workerServiceIds },
              raisedBy: "CLIENT"
            });
          } catch (err) {
            console.error("Error counting worker concerns:", err);
          }

          // Calculate concern counts against the client
          try {
            const clientServices = await this._serviceRepo.findByClientId(service.clientId);
            const clientServiceIds = clientServices.map(s => s.serviceId);
            clientConcernCount = await ConcernModel.countDocuments({
              serviceId: { $in: clientServiceIds },
              raisedBy: "WORKER"
            });
          } catch (err) {
            console.error("Error counting client concerns:", err);
          }
        }

        // Fetch details of user who raised the concern
        try {
          let raisedByUser = await this._userRepositoryFactory
            .getRepository(Role.CLIENT)
            .findById(concern.userId);

          raisedByUser ??= await this._userRepositoryFactory
            .getRepository(Role.WORKER)
            .findById(concern.userId);

          if (raisedByUser) {
            raisedByName = raisedByUser.name;
            raisedByEmail = raisedByUser.email;
          }
        } catch (e) {
          console.error("Error fetching raisedBy user details in GetAllConcernsUseCase", e);
        }

        const imagesWithUrls = concern.images && concern.images.length > 0
          ? await Promise.all(
              concern.images.map(async (img: string) => {
                if (!img) return "";
                if (img.startsWith("http")) return img;
                try {
                  return await this._s3Service.getPresignedDownloadUrl(img);
                } catch (err) {
                  console.error("Error signing concern image:", err);
                  return "";
                }
              })
            ).then(urls => urls.filter(Boolean))
          : [];

        return {
          ...concernObj,
          images: imagesWithUrls,
          clientName,
          clientEmail,
          workerName,
          workerEmail,
          raisedByName,
          raisedByEmail,
          serviceName,
          serviceDescription,
          serviceScheduledDate,
          serviceAmount,
          workerId,
          workerIsSuspended,
          workerSuspensionEndDate: workerSuspensionEndDate ? workerSuspensionEndDate.toISOString() : undefined,
          clientId,
          clientIsSuspended,
          clientSuspensionEndDate: clientSuspensionEndDate ? clientSuspensionEndDate.toISOString() : undefined,
          workerConcernCount,
          clientConcernCount,
        };
      })
    );

    return {
      concerns: populatedConcerns,
      total,
      totalPages,
    };
  }
}
