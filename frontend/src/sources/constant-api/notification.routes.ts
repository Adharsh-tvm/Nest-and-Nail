export const NOTIFICATION_ROUTES = {
    GET: `/api/notifications`,
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
};