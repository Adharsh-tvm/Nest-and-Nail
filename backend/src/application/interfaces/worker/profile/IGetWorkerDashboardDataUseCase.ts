export interface IGetWorkerDashboardDataUseCase {
    execute(workerId: string, months?: number): Promise<any>;
}
