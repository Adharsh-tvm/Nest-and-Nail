const BASE = "/api/worker";

export const WORKER_ROUTES = {
    SERVICES: `${BASE}/services`,
    ACTIVE_SERVICE: `${BASE}/services/active`,
    SERVICE_DETAILS: (id: string) => `${BASE}/services/${id}`,
    START_SERVICE: (id: string) => `${BASE}/services/${id}/start`,
    COMPLETE_SERVICE: (id: string) => `${BASE}/services/${id}/complete`,

    MEETINGS_SCHEDULED: `${BASE}/meetings/scheduled`,
    MEETINGS_HISTORY: `${BASE}/meetings/history`,
    MEETING_BY_ID: (id: string) => `${BASE}/meetings/${id}`,

    BLOCK_DATES: `${BASE}/slot/block-dates`,
    BLOCKED_DATES: `${BASE}/slot/blocked-dates`,
    DASHBOARD: `${BASE}/dashboard`,
};