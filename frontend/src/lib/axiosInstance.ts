import axios from "axios";
import { cookies } from "next/headers";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add cookies from Next.js server
axiosInstance.interceptors.request.use(
  async (config) => {
    // Only add cookies on server-side (Next.js server actions)
    if (typeof window === "undefined") {
      try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        // Also send cookies as Cookie header for double support
        const allCookies = cookieStore.getAll();
        if (allCookies.length > 0) {
          const cookieString = allCookies
            .map(cookie => `${cookie.name}=${cookie.value}`)
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

export default axiosInstance;