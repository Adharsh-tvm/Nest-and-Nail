import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetClientScheduledMeetingsUseCase } from "../../../interfaces/meetings/client/IGetClientScheduledVideoCallsUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";

export class GetClientScheduledMeetingsUseCase implements IGetClientScheduledMeetingsUseCase {

  constructor(private serviceRepo: IServiceRepository) { }

  async execute(clientId: string) {

    const services = await this.serviceRepo.getMeetingsByClient(clientId);

    const now = new Date();

    const scheduled = services.filter(s =>
      ["CONFIRMED", "IN_PROGRESS"].includes(s.status)
    );

    return scheduled.map(ServiceMapper.toResponse);
  }
}