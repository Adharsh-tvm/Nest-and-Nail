import { WorkerSchedule } from "../../../../domain/entities/WorkerSchedule";
import { BlockWorkerDatesDTO } from "../../../dtos/WorkerScheduleDTO";

export interface IBlockWorkerDatesUseCase {
  execute(dto: BlockWorkerDatesDTO): Promise<WorkerSchedule[]>;
}