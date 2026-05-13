import { AdminDashboardResponseDTO } from "../../dtos/admin/AdminDashboardDTO";

export interface IGetAdminDashboardDataUseCase {
    execute(): Promise<AdminDashboardResponseDTO>;
}