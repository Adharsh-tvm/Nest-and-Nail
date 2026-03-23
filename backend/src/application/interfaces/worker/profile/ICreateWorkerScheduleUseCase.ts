import { CreateWorkerScheduleDTO, WorkerScheduleDTO } from "../../../dtos/WorkerScheduleDTO";

export interface ICreateWorkerScheduleUseCase {
  execute(dto: CreateWorkerScheduleDTO): Promise<WorkerScheduleDTO[]>;
}
