

import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { MEDIA_ROUTES } from "@/sources/constant-api";

export async function getMediaUploadUrlApi(
    fileName: string,
    contentType: string
): Promise<
    ApiResponse<{
        uploadUrl: string;
        fileUrl: string; // This is the Key
        signedUrl: string; // This is the preview URL
    }>
> {
    const res = await axiosInstance.get<
        ApiResponse<{
            uploadUrl: string;
            fileUrl: string;
            signedUrl: string;
        }>
    >(MEDIA_ROUTES.S3_UPLOAD, {
        params: {
            fileName,
            contentType,
        },
    });

    return res.data;
}
