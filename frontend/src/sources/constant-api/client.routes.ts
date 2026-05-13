const BASE = "/api/client";

export const CLIENT_ROUTES = {
    WORKERS: `${BASE}/workers`,
    WORKER_DETAILS: (id: string) => `${BASE}/workers/${id}`,
    WORKER_AVAILABILITY: (id: string) =>
        `${BASE}/workers/${id}/availability`,

    BOOK_SERVICE: `${BASE}/services/book`,

    SERVICES_ONGOING: `${BASE}/services/ongoing`,
    SERVICES_HISTORY: `${BASE}/services/history`,
    SERVICE_BY_ID: (id: string) => `${BASE}/services/${id}`,
    CANCEL_SERVICE: (id: string) => `${BASE}/services/${id}/cancel`,

    MEETINGS_SCHEDULED: `${BASE}/meetings/scheduled`,
    MEETINGS_HISTORY: `${BASE}/meetings/history`,
    MEETING_BY_ID: (id: string) => `${BASE}/meetings/${id}`,
};