// services/upload/upload.api.ts
import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { UPLOAD_ROUTES } from "@/sources/constant-api";

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
    UPLOAD_ROUTES.WORKER_DOC(workerId),
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
    UPLOAD_ROUTES.WORKER_DOC(workerId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}
