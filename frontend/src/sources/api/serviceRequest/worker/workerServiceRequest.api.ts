"use server"

import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { ServiceRequestResponse } from "@/shared/types/ServiceRequestResponse";

export async function getOpenServiceRequestsApi(): Promise<
  ApiResponse<ServiceRequestResponse[]>
> {
  const res = await axiosInstance.get<ApiResponse<ServiceRequestResponse[]>>(
    "/api/service-requests/open"
  );
  return res.data;
}

export async function reserveServiceRequestApi(
  requestId: string
): Promise<ApiResponse<{ reservedUntil: string }>> {
  const res = await axiosInstance.post<ApiResponse<{ reservedUntil: string }>>(
    `/api/service-requests/${requestId}/reserve`
  );
  return res.data;
}