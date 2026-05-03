export const REVIEW_ROUTES = {
    ADD: (id: string) => `/api/review/${id}`,
};

export const CHAT_ROUTES = {
    GET_MESSAGES: (chatId: string) => `/chat/${chatId}`,
    SEND: `/chat/send`,
};

export const NOTIFICATION_ROUTES = {
    GET: `/api/notifications`,
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
};

export const MEDIA_ROUTES = {
    S3_UPLOAD: `/api/media/s3-upload-url`,
};

export const UPLOAD_ROUTES = {
    WORKER_DOC: (id: string) =>
        `/api/upload/worker/${id}/document`,
};

export const VIDEO_ROUTES = {
    END_MEETING: (id: string) =>
        `/api/video-call/end/${id}`,
};

export const CONCERN_ROUTES = {
    CREATE: `/api/concerns`,
};