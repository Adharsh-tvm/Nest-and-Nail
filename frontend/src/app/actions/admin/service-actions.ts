"use server";

import { AdminServiceResponseDTO } from "@/shared/types/serviceTypes";
import { fetchAdminServiceDetails, fetchAllAdminServices } from "@/sources/api/admin/admin.api";


export async function getAdminServicesAction(): Promise<{ success: boolean; data?: AdminServiceResponseDTO[]; error?: string }> {
    try {
        const response = await fetchAllAdminServices();
        return { success: true, data: response };
    } catch (error: any) {
        console.error("Failed to fetch admin services", error);
        return { success: false, error: error.message || "Failed to fetch admin services" };
    }
}

export async function getAdminServiceDetailsAction(serviceId: string): Promise<{ success: boolean; data?: AdminServiceResponseDTO; error?: string }> {
    try {
        const response = await fetchAdminServiceDetails(serviceId);
        return { success: true, data: response };
    } catch (error: any) {
        console.error("Failed to fetch admin service details", error);
        return { success: false, error: error.message || "Failed to fetch admin service details" };
    }
}
