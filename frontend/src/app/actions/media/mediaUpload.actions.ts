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
        signedUrl: string;
    }>
> {
    try {
        return await getMediaUploadUrlApi(fileName, contentType);
    } catch (error: unknown) {
        const errorMessage = (error instanceof Error ? error.message : undefined) || "Failed to get upload URL";
        return {
            success: false,
            message: String(errorMessage),
            error: null,
        };
    }
}
