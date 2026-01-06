"use client";

import { getAllUsers } from "@/app/actions/admin-actions";
import { User } from "@/shared/types/userTypes"; 
import { useEffect, useState } from "react";

export type UseUsersResult = {
    users: User[];
    loading: boolean;
    error: string | null;
};

export const useUsers = (): UseUsersResult => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await getAllUsers();
                console.log("[useUsers] API result:", result);

                if (!Array.isArray(result)) {
                    console.warn("[useUsers] expected array, got:", result);
                    if (!cancelled) setUsers([]);
                } else if (!cancelled) {
                    setUsers(result);
                }
            } catch (err: any) {
                console.error("[useUsers] error:", err);
                const msg = err?.message ?? "Failed to load users";
                if (!cancelled) setError(msg);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    return { users, loading, error };
};
