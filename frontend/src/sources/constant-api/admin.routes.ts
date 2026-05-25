const BASE = "/api/admin";

export const ADMIN_ROUTES = {
    CLIENTS: `${BASE}/clients`,
    WORKERS: `${BASE}/workers`,
    USERS: `${BASE}/users/all`,

    VERIFY: (id: string) => `${BASE}/verify/${id}`,
    REJECT: (id: string) => `${BASE}/reject/${id}`,
    ACCESS: (id: string) => `${BASE}/access/${id}`,
    SUSPEND: (id: string) => `${BASE}/suspend/${id}`,

    SERVICES: `${BASE}/services`,
    SERVICE_DETAILS: (id: string) => `${BASE}/services/${id}`,

    MEETINGS: `${BASE}/meetings`,
    MEETING_DETAILS: (id: string) => `${BASE}/meetings/${id}`,

    CONCERNS: `${BASE}/concerns`,

    CATEGORIES: `${BASE}/categories`,
    CATEGORY_BY_ID: (id: string) => `${BASE}/categories/${id}`,
    TOGGLE_CATEGORY: (id: string) =>
        `${BASE}/categories/${id}/toggle-status`,
    RESOLVE_CONCERN: (id: string) => `${BASE}/concerns/${id}/resolve`,
    DASHBOARD: `${BASE}/dashboard`,
};