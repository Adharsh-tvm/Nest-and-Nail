import axiosInstance from "@/lib/axiosInstance";


export async function uploadWorkerIdDocument(
  workerId: string,
  file: File
) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.post(
      `/api/upload/worker/${workerId}/document`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (error: any) {
    throw new Error(
      error.normalizedMessage || "Failed to upload ID document"
    );
  }
}



export async function uploadWorkerCertDocument(
  workerId: string,
  file: File
) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.post(
      `/api/upload/worker/${workerId}/document`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (error: any) {
    throw new Error(
      error.normalizedMessage || "Failed to upload certificate"
    );
  }
}