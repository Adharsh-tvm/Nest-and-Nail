const BASE = "/api/wallet";

export const WALLET_ROUTES = {
    BALANCE: `${BASE}/balance`,
    TRANSACTIONS: `${BASE}/transactions`,

    RECHARGE_ORDER: `${BASE}/recharge/create-order`,
    VERIFY_RECHARGE: `${BASE}/recharge/verify`,

    ADMIN_BALANCE: (id: string) =>
        `${BASE}/admin/${id}/balance`,
};