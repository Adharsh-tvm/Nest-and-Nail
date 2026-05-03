// services/upload/upload.api.ts
import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";

/* ---------------- TYPES ---------------- */

export type UploadResponse = {
  url: string;
  fileName?: string;
};

/* ---------------- API ---------------- */

export async function uploadWorkerIdDocument(
  workerId: string,
  file: File
): Promise<ApiResponse<UploadResponse>> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post<ApiResponse<UploadResponse>>(
    `/api/upload/worker/${workerId}/document`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}

export async function uploadWorkerCertDocument(
  workerId: string,
  file: File
): Promise<ApiResponse<UploadResponse>> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post<ApiResponse<UploadResponse>>(
    `/api/upload/worker/${workerId}/document`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}
