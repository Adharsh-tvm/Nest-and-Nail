"use client";

import { fetchAllWorkers, Worker } from "@/sources/api/admin/admin.api";
import { useEffect, useState } from "react";


type UseWorkersResult = {
    workers: Worker[];
    loading: boolean;
    error: string | null;
};

export const useWorkers = (): UseWorkersResult => {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchAllWorkers();
                console.log("[useWorkers] getAllWorkers result:", res);

                if (!Array.isArray(res)) {
                    console.warn("[useWorkers] expected array but got:", res);
                    setWorkers([]);
                } else if (!cancelled) {
                    setWorkers(res);
                }
            } catch (err: any) {
                console.error("[useWorkers] error:", err);
                const msg = err?.message ?? "Failed to load workers";
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

    return { workers, loading, error };
};