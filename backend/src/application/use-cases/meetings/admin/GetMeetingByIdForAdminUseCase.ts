import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IGetMeetingByIdForAdminUseCase } from "../../../interfaces/meetings/admin/IGetMeetingByIdForAdminUseCase";

export class GetMeetingByIdForAdminUseCase
  implements IGetMeetingByIdForAdminUseCase {

  constructor(private serviceRepository: IServiceRepository) {}

  async execute(serviceId: string) {
    const meeting = await this.serviceRepository.getMeetingByIdForAdmin(serviceId);

    if (!meeting) {
      throw new Error("Meeting not found");
    }

    return meeting;
  }
}