"use server";

import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";

export async function getMediaUploadUrlApi(
    fileName: string,
    contentType: string
): Promise<
    ApiResponse<{
        uploadUrl: string;
        fileUrl: string;
    }>
> {
    const res = await axiosInstance.get<
        ApiResponse<{
            uploadUrl: string;
            fileUrl: string;
        }>
    >("/api/media/s3-upload-url", {
        params: {
            fileName,
            contentType,
        },
    });

    return res.data;
}
