const BASE = "/api/auth";

export const AUTH_ROUTES = {
    LOGIN: `${BASE}/login`,
    REGISTER: `${BASE}/register`,
    REFRESH: `${BASE}/refresh`,
    LOGOUT: `${BASE}/logout`,
    VALIDATE: `${BASE}/validate`,
    SEND_OTP: `${BASE}/send-otp`,
    VERIFY_OTP: `${BASE}/verify-otp`,
    GOOGLE: `${BASE}/google`,
    FORGOT_PASSWORD: `${BASE}/forgot-password`,
    RESET_PASSWORD: `${BASE}/reset-password`,
    CHANGE_PASSWORD: `${BASE}/change-password`,
    MODE: `${BASE}/mode`,
    CURRENT_USER: (email: string) =>
        `${BASE}/current/${encodeURIComponent(email)}`,
};