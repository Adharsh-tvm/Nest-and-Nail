"use client";

import React, { useState } from "react";
import { Transaction } from "@/shared/types/transactionTypes";
import { ArrowUpRight, ArrowDownRight, CreditCard, CheckCircle2, Clock, XCircle } from "lucide-react";

interface Props {
  transactions: Transaction[];
  total: number;
  totalPages: number;
  role: "client" | "worker" | "admin";
}

export default function TransactionsView({ transactions, total, totalPages, role }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  // Optional: implement client-side or server-side pagination. For now we will just display what's passed in.

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-orange-500" />;
      case "FAILED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "PENDING":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "FAILED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-indigo-600" />
          Transaction History
        </h2>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-900">{total}</span>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
          <CreditCard className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-900">No transactions found</p>
          <p className="text-sm mt-1">Your transaction history will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Source</th>
                {role === "admin" && <th className="px-6 py-4 font-semibold">User ID</th>}
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <tr key={tx.transactionId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {tx.transactionId.substring(0, 12)}...
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(tx.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${tx.type === "CREDIT" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                      {tx.type === "CREDIT" ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {tx.source.replace("_", " ")}
                  </td>
                  {role === "admin" && (
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {tx.userId.substring(0, 8)}...
                    </td>
                  )}
                  <td className={`px-6 py-4 text-right font-bold ${tx.type === "CREDIT" ? "text-emerald-600" : "text-gray-900"}`}>
                    {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                      {getStatusIcon(tx.status)}
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex justify-center">
          <p className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages}. Pagination can be integrated here.
          </p>
        </div>
      )}
    </div>
  );
}
