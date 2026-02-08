"use server";

import { ApiResponse } from "@/shared/types/responseTypes";
import { ServiceRequestResponse } from "@/shared/types/ServiceRequestResponse";
import {
    getAllServiceRequestsApi,
    getServiceRequestByIdApi,
} from "@/sources/api/serviceRequest/admin/adminServiceRequest.api";

export async function getAllServiceRequestsAction(): Promise<
    ApiResponse<ServiceRequestResponse[]>
> {
    try {
        return await getAllServiceRequestsApi();
    } catch (error: any) {
        return {
            success: false,
            message:
                error.normalizedMessage ?? "Failed to fetch service requests",
            error: error.serverData ?? error.message,
        };
    }
}

export async function getServiceRequestByIdAction(
    requestId: string
): Promise<ApiResponse<ServiceRequestResponse>> {
    try {
        return await getServiceRequestByIdApi(requestId);
    } catch (error: any) {
        return {
            success: false,
            message:
                error.normalizedMessage ?? "Failed to fetch service request details",
            error: error.serverData ?? error.message,
        };
    }
}
