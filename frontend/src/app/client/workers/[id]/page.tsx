import React from 'react';
import { fetchOnlineWorkers, getCurrentUser } from '@/app/actions/users/user-actions';
import { redirect } from 'next/navigation';
import WorkerDetailsClient from './WorkerDetailsClient';

export default async function WorkerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const currentUser = await getCurrentUser();

    if (currentUser?.role === 'worker') {
        redirect('/worker');
    }

    const { id } = await params;

    // Since there is no specific getWorkerById for clients yet,
    // and we access this from the online workers list, we fetch online workers and find the one.
    const workers = await fetchOnlineWorkers();
    const worker = workers.find((w) => w.id === id);

    if (!worker) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-sans">
                <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Worker Not Found</h2>
                    <p className="text-gray-500">The worker may be offline or the URL is incorrect.</p>
                </div>
            </div>
        );
    }

    return (
        <WorkerDetailsClient worker={worker} />
    );
}
