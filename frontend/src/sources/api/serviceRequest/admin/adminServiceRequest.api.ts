"use server";

import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { ServiceRequestResponse } from "@/shared/types/ServiceRequestResponse";

export async function getAllServiceRequestsApi(): Promise<
    ApiResponse<ServiceRequestResponse[]>
> {
    const res = await axiosInstance.get<ApiResponse<ServiceRequestResponse[]>>(
        "/api/service-requests/admin/all"
    );
    return res.data;
}