import { LeaveVideoCallResponseDTO } from "../../dtos/common/videocall/LeaveVideoCallResponseDTO";

export interface ILeaveVideoCallUseCase {
  execute(
    serviceId: string,
    userId: string
  ): Promise<LeaveVideoCallResponseDTO>;
}