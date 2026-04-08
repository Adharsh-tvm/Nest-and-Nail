import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { v4 as uuidv4 } from "uuid";
import { ICreateVideoCallUseCase } from "../../../interfaces/meetings/client/ICreateVideoCallUseCase";

export class CreateVideoCallUseCase implements ICreateVideoCallUseCase {
  constructor(
    private readonly serviceRepository: IServiceRepository
  ) { }

  async execute(
    serviceId: string,
    clientId: string,
    startTime: Date,
    endTime: Date
  ): Promise<any> {

    const service = await this.serviceRepository.findById(serviceId);

    if (!service) {
      throw new Error("Service not found");
    }

    if (service.clientId !== clientId) {
      throw new Error("Unauthorized");
    }

    if (service.videoCall?.roomId) {
      throw new Error("Video call already scheduled");
    }

    const roomId = uuidv4();

    const meetingLink = `https://yourapp.com/meeting/${roomId}`;

    const videoCallData = {
      roomId,
      startTime,
      endTime,
      meetingLink,
    };

    const updatedService = await this.serviceRepository.updateVideoCall(
      serviceId,
      videoCallData
    );

    return updatedService;
  }
}