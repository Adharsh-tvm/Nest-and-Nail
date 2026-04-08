"use client";

import React from "react";
import { useClients } from "@/hooks/useClients";

import { Users, Search, Mail, Phone, MoreHorizontal } from "lucide-react";

const formatDate = (iso?: string | undefined) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
};

const ClientsView = () => {
  const { clients, loading, error } = useClients();

  console.log("[useClients] raw:", clients);

  if (loading) return <p className="p-6">Loading customers...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  if (!clients || clients.length === 0) {
    return <p className="p-6 text-slate-500">No clients found.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-4">
      <div className="flex justify-end gap-4 mb-2">
        <div className="bg-white px-6 py-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Clients</p>
            <p className="text-lg font-bold text-slate-800">{clients.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-600"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">Customer List</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-5 min-w-[200px]">Client</th>
                <th className="p-5 min-w-[250px]">Contact</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {clients.map((client, i) => {
                return (
                  <tr
                    key={client.user_id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {client.user_name ?? "Unnamed"}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: {client.user_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Mail className="w-3 h-3" />
                          {client.email_address ?? "—"}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone className="w-3 h-3" />
                          {client.phone ?? "—"}
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-slate-600">
                      {client.isBlocked ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                          Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="p-5 text-right">
                      <button className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientsView;
