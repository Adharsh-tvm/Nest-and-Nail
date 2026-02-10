import { ApiResponse } from "@/shared/types/responseTypes";
import { ServiceRequestResponse } from "@/shared/types/ServiceRequestResponse";
import { CreateServiceRequestDTO } from "@/shared/types/serviceTypes";
import { createServiceRequestApi, getMyServiceRequestsApi, getServiceRequestByIdApi } from "@/sources/api/serviceRequest/client/clientServiceRequest.api";

export async function createServiceRequestAction(
    payload: CreateServiceRequestDTO
): Promise<ApiResponse<ServiceRequestResponse>> {
    try {
        return await createServiceRequestApi(payload);
    } catch (error: any) {
        const errorMsg = error.serverData?.error || error.serverData?.message || error.normalizedMessage || "Failed to create service request";
        return {
            success: false,
            message: errorMsg,
            error: error.serverData ?? error.message,
        };
    }
}

export async function getMyServiceRequestsAction(): Promise<
    ApiResponse<ServiceRequestResponse[]>
> {
    try {
        return await getMyServiceRequestsApi();
    } catch (error: any) {
        return {
            success: false,
            message: error.normalizedMessage ?? "Failed to fetch your requests",
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
            message: error.normalizedMessage ?? "Failed to fetch service request details",
            error: error.serverData ?? error.message,
        };
    }
}



