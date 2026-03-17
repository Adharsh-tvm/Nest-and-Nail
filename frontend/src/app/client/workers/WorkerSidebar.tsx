"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Navigation, Map, X, Wifi, SlidersHorizontal, RotateCcw } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Category } from '@/shared/types/categoryTypes';

// Lazy load map to avoid SSR issues
const LocationPicker = dynamic(
    () => import('@/app/components/containers/layout/LocationPicker').then(m => m.LocationPicker),
    { ssr: false, loading: () => <div className="h-[280px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-sm text-gray-400">Loading map...</div> }
);

interface WorkerSidebarProps {
    categories: Category[];
    activeCategory?: string;
}

export default function WorkerSidebar({ categories, activeCategory }: WorkerSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [locationText, setLocationText] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [pendingLat, setPendingLat] = useState<number | null>(null);
    const [pendingLng, setPendingLng] = useState<number | null>(null);
    const [isOnline, setIsOnline] = useState(false);
    // isMounted prevents createPortal from running on the server
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    // Lock background scroll while map is open
    useEffect(() => {
        document.body.style.overflow = showMap ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [showMap]);

    // Sync state from URL params
    useEffect(() => {
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        setLocationText(lat && lng ? `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}` : '');
        setIsOnline(searchParams.get('isOnline') === 'true');
    }, [searchParams]);

    // Push updated params to URL
    const pushParam = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === null) params.delete(key);
        else params.set(key, value);
        router.push(`?${params.toString()}`);
    };

    // Category dropdown change
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        pushParam('category', e.target.value || null);
    };

    // Online toggle
    const handleOnlineToggle = () => {
        pushParam('isOnline', isOnline ? null : 'true');
    };

    // Clear all filtersa
    const handleClearFilters = () => {
        router.push('?');
    };

    // GPS location
    const handleGps = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('lat', coords.latitude.toString());
                params.set('lng', coords.longitude.toString());
                router.push(`?${params.toString()}`);
                setIsLocating(false);
            },
            () => {
                alert('Unable to access location. Please check browser permissions.');
                setIsLocating(false);
            }
        );
    };

    // Map picker
    const handleOpenMap = () => {
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        setPendingLat(lat ? parseFloat(lat) : null);
        setPendingLng(lng ? parseFloat(lng) : null);
        setShowMap(true);
    };

    const handleApplyMap = () => {
        if (pendingLat !== null && pendingLng !== null) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('lat', pendingLat.toString());
            params.set('lng', pendingLng.toString());
            router.push(`?${params.toString()}`);
        }
        setShowMap(false);
    };

    const handleClearLocation = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('lat');
        params.delete('lng');
        router.push(`?${params.toString()}`);
    };

    // Check if any filter is active
    const hasActiveFilters = !!(activeCategory || locationText || isOnline);

    return (
        <>
            {/* Sidebar */}
            <aside className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                            <RotateCcw className="w-3 h-3" />
                            Reset
                        </button>
                    )}
                </div>

                <hr className="border-gray-100" />

                {/* Category Filter */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</label>
                    <select
                        value={activeCategory || ''}
                        onChange={handleCategoryChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-colors cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <hr className="border-gray-100" />

                {/* Availability Filter */}
                <div className="flex flex-col gap-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Availability</label>
                    <button
                        onClick={handleOnlineToggle}
                        className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                            isOnline
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Wifi className="w-4 h-4" />
                            Online Only
                        </div>
                        {/* Toggle switch */}
                        <div className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${isOnline ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${isOnline ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                    </button>
                </div>

                <hr className="border-gray-100" />

                {/* Location Filter */}
                <div className="flex flex-col gap-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</label>
                    <p className="text-xs text-gray-400">Set your location to sort workers by distance</p>

                    {locationText ? (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                            <div className="flex items-center gap-2 text-emerald-700 text-xs font-medium">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <span className="truncate">{locationText}</span>
                            </div>
                            <button onClick={handleClearLocation} className="shrink-0 text-emerald-400 hover:text-red-500 ml-2">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleGps}
                                disabled={isLocating}
                                className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                            >
                                {isLocating ? <span className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /> : <Navigation className="w-4 h-4" />}
                                Use my location
                            </button>
                            <button
                                onClick={handleOpenMap}
                                className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                            >
                                <Map className="w-4 h-4" />
                                Pick on map
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Full-screen map overlay — rendered via portal at document.body to escape all stacking contexts */}
            {isMounted && showMap && createPortal(
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setShowMap(false)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 9998,
                            background: 'rgba(15, 23, 42, 0.65)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                        }}
                    />

                    {/* Modal card */}
                    <div
                        style={{
                            position: 'fixed', zIndex: 9999,
                            top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90vw', maxWidth: '560px',
                            background: 'white',
                            borderRadius: '20px',
                            boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div>
                                <h2 className="text-base font-bold text-gray-900">Pick a Location</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Click anywhere on the map to set your location</p>
                            </div>
                            <button onClick={() => setShowMap(false)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Map */}
                        <div style={{ height: '320px', margin: '12px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                            <LocationPicker
                                onLocationSelect={(lat, lng) => { setPendingLat(lat); setPendingLng(lng); }}
                                initialLat={pendingLat ?? undefined}
                                initialLng={pendingLng ?? undefined}
                            />
                        </div>

                        {pendingLat !== null && (
                            <p className="text-xs text-center text-gray-400 -mt-1 pb-2">
                                📍 <span className="font-semibold text-emerald-600">{pendingLat.toFixed(4)}, {pendingLng?.toFixed(4)}</span>
                            </p>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
                            <button onClick={handleGps} disabled={isLocating} className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 border border-emerald-200 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors">
                                {isLocating ? <span className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                                Use GPS
                            </button>
                            <div className="flex gap-2">
                                <button onClick={() => setShowMap(false)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button onClick={handleApplyMap} disabled={pendingLat === null} className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-40 shadow-sm">
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    );
}

