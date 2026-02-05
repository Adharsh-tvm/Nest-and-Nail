import { ApiResponse } from "@/shared/types/responseTypes";
import { ServiceRequestResponse } from "@/shared/types/ServiceRequestResponse";
import { CreateServiceRequestDTO } from "@/shared/types/serviceTypes";
import { createServiceRequestApi, getMyServiceRequestsApi } from "@/sources/api/serviceRequest/client/clientServiceRequest.api";

export async function createServiceRequestAction(
    payload: CreateServiceRequestDTO
): Promise<ApiResponse<ServiceRequestResponse>> {
    try {
        return await createServiceRequestApi(payload);
    } catch (error: any) {
        return {
            success: false,
            message:
                error.normalizedMessage ??
                "Failed to create service request",
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


