"use server";

import { ApiResponse } from "@/shared/types/responseTypes";
import { getMediaUploadUrlApi } from "@/sources/api/media/mediaUpload.api";

export async function getMediaUploadUrlAction(
    fileName: string,
    contentType: string
): Promise<
    ApiResponse<{
        uploadUrl: string;
        fileUrl: string;
    }>
> {
    try {
        return await getMediaUploadUrlApi(fileName, contentType);
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to get upload URL",
            error,
        };
    }
}
