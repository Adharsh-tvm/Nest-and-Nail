import { getAllUsers } from "@/app/actions/admin/admin-actions";
import { User, UserQueryParams } from "@/shared/types/userTypes";
import { useEffect, useState, useCallback, useRef } from "react";

export type UseUsersResult = {
    users: User[];
    loading: boolean;
    error: string | null;
    total: number;
    totalPages: number;
    refetch: () => void;
};

export const useUsers = (params: UserQueryParams = {}): UseUsersResult => {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Use a ref to track if the component is mounted to avoid state updates on unmounted component
    const mountedRef = useRef(true);

    // Memoize the load function
    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await getAllUsers(params);

            if (mountedRef.current) {
                setUsers(result.users);
                setTotal(result.total);
                setTotalPages(result.totalPages);
            }
        } catch (err: any) {
            console.error("[useUsers] error:", err);
            const msg = err?.message ?? "Failed to load users";
            if (mountedRef.current) setError(msg);
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [
        params.page,
        params.limit,
        params.search,
        params.isBlocked,
        params.isVerified,
        params.sortBy,
        params.sortOrder,
    ]);

    useEffect(() => {
        mountedRef.current = true;
        load();
        return () => {
            mountedRef.current = false;
        };
    }, [load]);

    return { users, loading, error, total, totalPages, refetch: load };
};
