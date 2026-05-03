"use client";

import React, { useState, useEffect } from "react";
import { Wallet as WalletIcon, CreditCard } from "lucide-react";
import { getWalletBalanceAction, getTransactionsAction } from "@/app/actions/client/wallet-actions";

export default function AdminWalletPage() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWallet = async () => {
    setIsLoading(true);
    const balanceRes = await getWalletBalanceAction();
    if (balanceRes.success && balanceRes.data) {
      setBalance(balanceRes.data.balance);
    }
    const txRes = await getTransactionsAction();
    if (txRes.success && txRes.data) {
      const txData = Array.isArray(txRes.data) ? txRes.data : txRes.data.transactions || [];
      setTransactions(txData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Platform Wallet</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor platform fees and administrative balance
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden h-[300px] flex flex-col justify-between">
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">
                    Available Balance
                  </p>
                  <h2 className="text-5xl font-black mt-4 tracking-tight">
                    {isLoading ? "..." : `₹${balance.toLocaleString()}`}
                  </h2>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <WalletIcon className="text-indigo-200" size={32} />
                </div>
              </div>
            </div>
            <div className="relative z-10 border-t border-indigo-800/50 pt-6">
              <p className="text-sm text-indigo-300">
                All platform fees and admin credits will be reflected here.
              </p>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <CreditCard size={20} />
              </div>
              Recent Transactions
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <WalletIcon size={32} className="text-gray-300" />
                </div>
                <h4 className="text-gray-900 font-bold mb-1">No transactions yet</h4>
                <p className="text-gray-500 text-sm">Platform fees will appear here once bookings are paid.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {transactions.map((tx: any, idx: number) => (
                  <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3.5 rounded-2xl ${tx.type === "CREDIT" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                        {tx.type === "CREDIT" ? <WalletIcon size={20} /> : <CreditCard size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 capitalize text-base">
                          {tx.source.replace(/_/g, " ").toLowerCase()}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} at {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-black text-lg ${tx.type === "CREDIT" ? "text-emerald-600" : "text-gray-900"}`}>
                        {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount}
                      </div>
                      <div className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                        {tx.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}