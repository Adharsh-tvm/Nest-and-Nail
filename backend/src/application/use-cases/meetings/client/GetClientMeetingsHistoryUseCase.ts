import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetClientScheduledMeetingsUseCase } from "../../../interfaces/meetings/client/IGetClientScheduledVideoCallsUseCase";
import { ServiceMapper } from "../../../mappers/ServiceMapper";

export class GetClientMeetingsHistoryUseCase implements IGetClientScheduledMeetingsUseCase {

  constructor(private serviceRepo: IServiceRepository) { }

  async execute(clientId: string) {

    const services = await this.serviceRepo.getMeetingsByClient(clientId);

    const now = new Date();

    const history = services.filter(s =>
      !["OPEN", "PENDING", "CONFIRMED", "IN_PROGRESS"].includes(s.status)
    );

    return history.map(ServiceMapper.toResponse);
  }
}