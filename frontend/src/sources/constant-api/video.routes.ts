export const VIDEO_ROUTES = {
    JOIN_MEETING: (id: string) => `/api/video-call/join/${id}`,
    LEAVE_MEETING: (id: string) => `/api/video-call/leave/${id}`,
    END_MEETING: (id: string) => `/api/video-call/end/${id}`,
};