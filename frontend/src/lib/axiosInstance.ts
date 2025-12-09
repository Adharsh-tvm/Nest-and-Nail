import axios from "axios";
import { cookies } from "next/headers";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR

axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") {
      try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        const allCookies = cookieStore.getAll();
        if (allCookies.length > 0) {
          const cookieString = allCookies
            .map((c) => `${c.name}=${c.value}`)
            .join("; ");
          config.headers.Cookie = cookieString;
        }
      } catch (error) {
        console.error("Error reading cookies:", error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ERROR RESPONSE INTERCEPTOR

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    console.error("🚨 API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status,
      message,
    });

    // 🌐 Handle specific errors
    switch (status) {
      case 400:
        // toast.error(message || "Bad Request");
        break;

      case 401:
        console.warn("Unauthorized — clearing session");

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        break;

      case 403:
        // toast.error("You don't have permission to perform this action.");
        break;

      case 404:
        // toast.error("Resource not found.");
        break;

      case 500:
        // toast.error("Server error. Please try again later.");
        break;

      default:
        // toast.error(message || "Unexpected error occurred.");
        break;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
