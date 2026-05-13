"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function WorkerSearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get('search') || '');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const params = new URLSearchParams(searchParams.toString());
            if (keyword.trim()) {
                params.set('search', keyword.trim());
            } else {
                params.delete('search');
            }
            router.push(`?${params.toString()}`);
        }
    };

    const handleClear = () => {
        setKeyword('');
        const params = new URLSearchParams(searchParams.toString());
        params.delete('search');
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm gap-3">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search workers by name… press Enter"
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            {keyword && (
                <button onClick={handleClear} className="text-gray-400 hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
