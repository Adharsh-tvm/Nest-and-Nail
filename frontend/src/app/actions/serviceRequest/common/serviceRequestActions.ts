import { ApiResponse } from "@/shared/types/responseTypes";
import { releaseServiceRequestApi } from "@/sources/api/serviceRequest/client/clientServiceRequest.api";


export async function releaseServiceRequestAction(
    requestId: string
): Promise<ApiResponse<null>> {
    try {
        return await releaseServiceRequestApi(requestId);
    } catch (error: any) {
        return {
            success: false,
            message:
                error.normalizedMessage ??
                "Failed to release service request",
            error: error.serverData ?? error.message,
        };
    }
}