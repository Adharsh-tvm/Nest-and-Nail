"use server"

import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";

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