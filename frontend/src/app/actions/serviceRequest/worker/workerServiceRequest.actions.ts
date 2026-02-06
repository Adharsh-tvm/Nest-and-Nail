import { ApiResponse } from "@/shared/types/responseTypes";
import { ServiceRequestResponse } from "@/shared/types/ServiceRequestResponse";
import { getOpenServiceRequestsApi, reserveServiceRequestApi } from "@/sources/api/serviceRequest/worker/workerServiceRequest.api";

export async function getOpenServiceRequestsAction(
    lat: number,
    lng: number
): Promise<ApiResponse<ServiceRequestResponse[]>> {
    try {
        return await getOpenServiceRequestsApi(lat, lng);
    } catch (error: any) {
        return {
            success: false,
            message:
                error.normalizedMessage ??
                "Failed to fetch service requests",
            error: error.serverData ?? error.message,
        };
    }
}



export async function reserveServiceRequestAction(
    requestId: string
): Promise<ApiResponse<{ reservedUntil: string }>> {
    try {
        return await reserveServiceRequestApi(requestId);
    } catch (error: any) {
        return {
            success: false,
            message:
                error.normalizedMessage ??
                "Failed to reserve service request",
            error: error.serverData ?? error.message,
        };
    }
}