"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function WorkerSort() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || '';

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        if (val) {
            params.set('sort', val);
        } else {
            params.delete('sort');
        }
        // Also reset page when sorting changes
        params.delete('page');
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-600 hidden sm:block">Sort by:</label>
            <select
                id="sort"
                value={currentSort}
                onChange={handleSortChange}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-colors cursor-pointer shadow-sm"
            >
                <option value="">Recommended</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="distance_asc">Nearest Distance</option>
            </select>
        </div>
    );
}
