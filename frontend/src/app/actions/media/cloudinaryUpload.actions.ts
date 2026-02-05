"use server";

import { ApiResponse } from "@/shared/types/responseTypes";
import { getCloudinarySignatureApi } from "@/sources/api/media/cloudinaryUpload,api";

export async function getCloudinarySignatureAction(): Promise<
  ApiResponse<any>
> {
  try {
    return await getCloudinarySignatureApi();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to get upload signature",
      error,
    };
  }
}
