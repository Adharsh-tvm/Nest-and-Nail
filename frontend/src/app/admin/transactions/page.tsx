import React from "react";
import { getAdminTransactionsAction } from "@/app/actions/transaction/transaction-actions";
import TransactionsView from "@/app/components/containers/transactions/TransactionsView";

export const metadata = {
  title: "All Transactions | Admin",
};

export default async function AdminTransactionsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const limit = 10;

  const res = await getAdminTransactionsAction(page, limit);

  const transactions = res.success && res.data ? res.data.transactions : [];
  const total = res.success && res.data ? res.data.total : 0;
  const totalPages = res.success && res.data ? res.data.totalPages : 1;

  return (
    <div className="min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              System Transactions
            </h1>
            <p className="text-gray-500">
              Overview of all platform transactions including escrow and payouts.
            </p>
          </div>
        </div>

        <TransactionsView
          transactions={transactions}
          total={total}
          totalPages={totalPages}
          role="admin"
        />
      </div>
    </div>
  );
}