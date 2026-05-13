import React from "react";
import { getWorkerTransactionsAction } from "@/app/actions/transaction/transaction-actions";
import TransactionsView from "@/app/components/containers/transactions/TransactionsView";

export const metadata = {
  title: "My Transactions | Worker",
};

export default async function WorkerTransactionsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const limit = 10;

  const res = await getWorkerTransactionsAction(page, limit);

  const transactions = res.success && res.data ? res.data.transactions : [];
  const total = res.success && res.data ? res.data.total : 0;
  const totalPages = res.success && res.data ? res.data.totalPages : 1;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            My Transactions
          </h1>
          <p className="text-gray-500">
            View your earnings, escrow releases, and wallet history.
          </p>
        </div>

        <TransactionsView
          transactions={transactions}
          total={total}
          totalPages={totalPages}
          role="worker"
        />
      </div>
    </div>
  );
}