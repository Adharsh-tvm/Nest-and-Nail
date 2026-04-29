import { v4 as uuidv4 } from "uuid";
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IConcernRepository } from "../../../domain/repositories/IConcernRepository";
import { ICreateConcernUseCase } from "../../interfaces/concern/ICreateConcernUseCase";
import { concernBy, concernStatus } from "../../../shared/enums/concernEnums";

export class CreateConcernUseCase implements ICreateConcernUseCase {
  constructor(
    private readonly _concernRepo: IConcernRepository,
    private readonly _serviceRepo: IServiceRepository
  ) {}

  async execute(serviceId: string, userId: string, role: concernBy, message: string) {

    const service = await this._serviceRepo.findById(serviceId);

    if (!service) throw new Error("Service not found");

    if (service.status !== "COMPLETED") {
      throw new Error("Concern can be raised only after completion");
    }

    const concern = {
      concernId: uuidv4(),
      serviceId,
      userId,
      raisedBy: role,
      message,
      status: concernStatus.OPEN,
      createdAt: new Date()
    };

    return await this._concernRepo.create(concern);
  }
}