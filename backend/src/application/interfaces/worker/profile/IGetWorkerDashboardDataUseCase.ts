import { WorkerDashboardResponseDTO } from "../../../dtos/worker/WorkerDashboardDTO";

export interface IGetWorkerDashboardDataUseCase {
    execute(workerId: string, months?: number): Promise<WorkerDashboardResponseDTO>;
}
