import { VideoCallResponseDTO } from "../../dtos/common/videocall/VideoCallResponseDTO";

export interface IEndVideoCallUseCase {
  execute(
    serviceId: string,
    userId: string
  ): Promise<VideoCallResponseDTO>;
}