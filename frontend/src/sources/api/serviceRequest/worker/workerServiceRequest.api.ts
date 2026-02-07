"use server"

import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { ServiceRequestResponse } from "@/shared/types/ServiceRequestResponse";

export async function getOpenServiceRequestsApi(
  lat: number,
  lng: number,
  radius = 10000
) {
  const res = await axiosInstance.get(
    `/api/service-requests/open`,
    {
      params: { lat, lng, radius }
    }
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

export async function getServiceRequestByIdApi(requestId: string): Promise<ApiResponse<ServiceRequestResponse>> {
  const res = await axiosInstance.get<ApiResponse<ServiceRequestResponse>>(
    `/api/service-requests/${requestId}`
  );
  return res.data;
}