import { GetWorkerBlockedDatesResponseDTO } from "../../../dtos/WorkerScheduleDTO";

export interface IGetWorkerBlockedDatesUseCase {
  execute(workerId: string): Promise<GetWorkerBlockedDatesResponseDTO[]>;
}