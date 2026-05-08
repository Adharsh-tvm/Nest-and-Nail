import { JoinVideoCallResponseDTO } from "../../dtos/common/videocall/JoinVideoCallResponseDTO";

export interface IJoinVideoCallUseCase {
  execute(
    serviceId: string,
    userId: string
  ): Promise<JoinVideoCallResponseDTO>;
}