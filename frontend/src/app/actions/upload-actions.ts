"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL; 
// Upload Government ID
export async function uploadIdDocumentAction(workerId: string, file: File) {

    const userCookies = await cookies()
    const token = userCookies.get("accessToken")?.value;

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
        `${BASE_URL}/api/upload/worker/${workerId}/document`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}

// Upload Certification
export async function uploadCertDocumentAction(workerId: string, file: File) {

    const userCookies = await cookies()
    const token = userCookies.get("accessToken")?.value;

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
        `${BASE_URL}/upload/worker/${workerId}/document`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}

