const BASE = "/api/users";

export const USER_ROUTES = {
    CATEGORIES: `${BASE}/categories`,
    ONLINE_WORKERS: `${BASE}/workers/online`,

    SKILLS: (id: string) => `${BASE}/${id}/skills`,
    ADD_ADDRESS: (id: string) => `${BASE}/${id}/addresses`,
    UPDATE_ADDRESS: (userId: string, addressId: string) =>
        `${BASE}/${userId}/addresses/${addressId}`,
    DELETE_ADDRESS: (userId: string, addressId: string) =>
        `${BASE}/${userId}/addresses/${addressId}`,

    UPDATE_CATEGORIES: (id: string) =>
        `${BASE}/categories/${id}`,
};