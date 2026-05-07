import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { WORKER_ROUTES } from "@/sources/constant-api/worker.routes";

export async function fetchWorkerDashboardData(months?: number): Promise<ApiResponse<any>> {
  const query = months ? `?months=${months}` : '';
  const res = await axiosInstance.get<ApiResponse<any>>(`${WORKER_ROUTES.DASHBOARD}${query}`);
  return res.data;
}
