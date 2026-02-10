"use server";

import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { ServiceRequestResponse } from "@/shared/types/ServiceRequestResponse";
import { CreateServiceRequestDTO } from "@/shared/types/serviceTypes";

export async function createServiceRequestApi(
  payload: CreateServiceRequestDTO
): Promise<ApiResponse<ServiceRequestResponse>> {
  const res = await axiosInstance.post<ApiResponse<ServiceRequestResponse>>(
    "/api/service-requests",
    payload
  );
  return res.data;
}

export async function releaseServiceRequestApi(
  requestId: string
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.post<ApiResponse<null>>(
    `/api/service-requests/${requestId}/release`
  );
  return res.data;
}

export async function getMyServiceRequestsApi(): Promise<
  ApiResponse<ServiceRequestResponse[]>
> {
  const res = await axiosInstance.get(
    "/api/service-requests/my"
  );
  return res.data;
}

export async function getServiceRequestByIdApi(
  requestId: string
): Promise<ApiResponse<ServiceRequestResponse>> {
  const res = await axiosInstance.get<ApiResponse<ServiceRequestResponse>>(
    `/api/service-requests/${requestId}`
  );
  return res.data;
}

export async function deleteServiceRequestApi(
  requestId: string
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    `/api/service-requests/${requestId}`
  );
  return res.data;
}
