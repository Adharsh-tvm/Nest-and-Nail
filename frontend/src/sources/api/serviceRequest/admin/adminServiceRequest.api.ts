"use server";

import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { ServiceRequestResponse } from "@/shared/types/ServiceRequestResponse";

export async function getAllServiceRequestsApi(): Promise<
    ApiResponse<ServiceRequestResponse[]>
> {
    const res = await axiosInstance.get<ApiResponse<ServiceRequestResponse[]>>(
        "/api/admin/service-requests"
    );
    return res.data;
}

export async function getServiceRequestByIdApi(
    requestId: string
): Promise<ApiResponse<ServiceRequestResponse>> {
    const res = await axiosInstance.get<ApiResponse<ServiceRequestResponse>>(
        `/api/admin/service-requests/${requestId}`
    );
    return res.data;
}
