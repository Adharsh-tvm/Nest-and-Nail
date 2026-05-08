import { v4 as uuidv4 } from "uuid";
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IConcernRepository } from "../../../domain/repositories/IConcernRepository";
import { ICreateConcernUseCase } from "../../interfaces/concern/ICreateConcernUseCase";
import { concernBy, concernStatus } from "../../../shared/enums/concernEnums";
import { S3Service } from "../../../infrastructure/adapters/S3service";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";

export class CreateConcernUseCase implements ICreateConcernUseCase {
  constructor(
    private readonly _concernRepo: IConcernRepository,
    private readonly _serviceRepo: IServiceRepository,
    private readonly _s3Service: S3Service
  ) {}

  async execute(
    serviceId: string,
    userId: string,
    role: concernBy,
    message: string,
    files?: { path: string; mimetype: string; originalname: string }[]
  ) {

    const service = await this._serviceRepo.findById(serviceId);

    if (!service) throw new Error("Service not found");

    if (service.status !== ServiceStatus.COMPLETED) {
      throw new Error("Concern can be raised only after completion");
    }

    const uploadedKeys: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const fileExtension = file.originalname.split(".").pop();
        const key = `concerns/${serviceId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
        await this._s3Service.uploadFile(file.path, key, file.mimetype);
        uploadedKeys.push(key);
      }
    }

    const concern = {
      concernId: uuidv4(),
      serviceId,
      userId,
      raisedBy: role,
      message,
      status: concernStatus.OPEN,
      createdAt: new Date(),
      images: uploadedKeys
    };

    return await this._concernRepo.create(concern);
  }
}