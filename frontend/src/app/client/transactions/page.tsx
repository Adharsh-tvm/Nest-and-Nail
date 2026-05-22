import React from "react";
import { getClientTransactionsAction } from "@/app/actions/transaction/transaction-actions";
import TransactionsView from "@/app/components/containers/transactions/TransactionsView";

export const metadata = {
  title: "My Transactions | Client",
};

export default async function ClientTransactionsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const limit = 10;

  const res = await getClientTransactionsAction(page, limit);

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
            View and manage your payment history and wallet transactions.
          </p>
        </div>

        <TransactionsView
          transactions={transactions}
          total={total}
          totalPages={totalPages}
          role="client"
        />
      </div>
    </div>
  );
}