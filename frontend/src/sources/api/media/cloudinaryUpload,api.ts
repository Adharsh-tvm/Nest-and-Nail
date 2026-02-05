"use server";

import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";

export async function getCloudinarySignatureApi(): Promise<
  ApiResponse<{
    cloudName: string;
    apiKey: string;
    timestamp: number;
    signature: string;
    folder: string;
  }>
> {
  const res = await axiosInstance.get<
    ApiResponse<{
      cloudName: string;
      apiKey: string;
      timestamp: number;
      signature: string;
      folder: string;
    }>
  >("/media/cloudinary/signature");

  return res.data;
}
