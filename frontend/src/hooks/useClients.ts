"use client";

import { useEffect, useState } from "react";
import { adminApi, Client } from "@/services/auth/admin.api";  

type UseClientsResult = {
  clients: Client[]; // default empty array for safe mapping
  loading: boolean;
  error: string | null;
};

export const useClients = (): UseClientsResult => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminApi.getAllClients();
        console.log("[useClients] getAllClients result:", res);

        if (!Array.isArray(res)) {
          console.warn("[useClients] expected array but got:", res);
          setClients([]);
        } else if (!cancelled) {
          setClients(res);
        }
      } catch (err: any) {
        console.error("[useClients] error:", err);
        const msg = err?.response?.data?.message ?? err.message ?? "Failed to load clients";
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

  return { clients, loading, error };
};
