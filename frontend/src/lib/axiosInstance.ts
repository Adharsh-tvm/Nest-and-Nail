

import axios from "axios";
import { cookies } from "next/headers";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") {
      try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        if (accessToken) {
          config.headers = config.headers || {};
          const headers = config.headers as unknown as Record<string, string>;
          headers["Authorization"] = `Bearer ${accessToken}`;
        }
        const allCookies = cookieStore.getAll();
        if (allCookies.length > 0) {
          const cookieString = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");
          const headers = config.headers as unknown as Record<string, string>;
          headers["Cookie"] = cookieString;
        }
      } catch (err) {
        console.error("Error reading cookies in request interceptor:", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const serverData = error?.response?.data;
    const serverMsg = serverData?.message || serverData?.error || null;

    try {
      interface CustomError {
        normalizedMessage?: string;
        serverData?: unknown;
      }
      const customError = error as unknown as CustomError;
      customError.normalizedMessage = serverMsg || error.message || `Request failed with status ${status}`;
      customError.serverData = serverData || null;
    } catch (attachErr) {
    }

    console.error("🚨 API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status,
      message: serverMsg || error.message,
      serverData,
    });

    if (status === 401 && typeof window !== "undefined") {
      console.warn("Unauthorized — clearing session and redirecting to /login");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
