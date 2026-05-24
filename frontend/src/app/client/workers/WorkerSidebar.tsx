"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Navigation, Map, X, Wifi, SlidersHorizontal, RotateCcw, ChevronRight } from 'lucide-react';
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
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
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

    // GPS location — used from sidebar (applies immediately)
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
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
        );
    };

    // GPS location — used from inside the map modal (pins on map, does NOT navigate)
    const handleGpsInMap = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setPendingLat(coords.latitude);
                setPendingLng(coords.longitude);
                setIsLocating(false);
            },
            () => {
                alert('Unable to access location. Please check browser permissions.');
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
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
            {/* Mobile Filter Toggle Button */}
            <button
                type="button"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="w-full lg:hidden flex items-center justify-between bg-white border border-gray-200 rounded-[1.5rem] px-5 py-4 shadow-sm hover:border-[#1B4332] transition-all font-bold text-gray-900 mb-4"
            >
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-[#1B4332]" />
                    <span>Filter Workers</span>
                    {hasActiveFilters && (
                        <span className="bg-[#1B4332] text-white text-[10px] font-bold rounded-full px-2 py-0.5 ml-2 uppercase tracking-wider">
                            Active
                        </span>
                    )}
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isFiltersOpen ? 'rotate-90' : ''}`} />
            </button>

            {/* Sidebar */}
            <aside className={`w-full glass rounded-[2.5rem] border border-gray-100 p-8 flex flex-col gap-8 animate-fade-in shadow-sm hover:premium-shadow transition-all duration-500 lg:flex ${isFiltersOpen ? 'flex' : 'hidden'}`}>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-900 font-bold text-base">
                        <SlidersHorizontal className="w-5 h-5 text-primary" />
                        Refine Search
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-bold uppercase tracking-widest transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset
                        </button>
                    )}
                </div>

                <hr className="border-gray-100" />

                {/* Category Filter */}
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Service Category</label>
                    <div className="relative group">
                        <select
                            value={activeCategory || ''}
                            onChange={handleCategoryChange}
                            className="w-full appearance-none border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-900 bg-white/50 backdrop-blur-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer shadow-sm"
                        >
                            <option value="">All Expertise</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
                            <ChevronRight className="w-4 h-4 rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Availability Filter */}
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Real-time Availability</label>
                    <button
                        onClick={handleOnlineToggle}
                        className={`flex items-center justify-between w-full px-5 py-3.5 rounded-2xl border transition-all duration-300 ${
                            isOnline
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-white border-gray-100 text-gray-900 hover:border-primary/30 shadow-sm'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Wifi className={`w-4 h-4 ${isOnline ? 'text-emerald-300' : 'text-primary'}`} />
                            <span className="text-sm font-bold">Online Only</span>
                        </div>
                        {/* Toggle switch */}
                        <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${isOnline ? 'bg-white/20' : 'bg-gray-100'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${isOnline ? 'translate-x-4' : 'translate-x-0'} ${isOnline ? '' : 'bg-gray-400'}`} />
                        </div>
                    </button>
                </div>

                <hr className="border-gray-100" />

                {/* Location Filter */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Proximity Search</label>
                        <p className="text-[10px] text-gray-400 ml-1 leading-relaxed">Find experts nearest to your current location.</p>
                    </div>

                    {locationText ? (
                        <div className="flex items-center justify-between bg-emerald-50/50 border border-emerald-100 rounded-[1.5rem] px-5 py-4 group animate-fade-in">
                            <div className="flex items-center gap-3 text-emerald-800 text-xs font-bold">
                                <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                </div>
                                <span className="truncate max-w-[120px]">{locationText}</span>
                            </div>
                            <button onClick={handleClearLocation} className="p-2 text-emerald-300 hover:text-rose-500 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={handleGps}
                                disabled={isLocating}
                                className="flex items-center justify-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-900 hover:premium-shadow hover:border-primary transition-all group"
                            >
                                {isLocating ? <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <Navigation className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />}
                                Use GPS
                            </button>
                            <button
                                onClick={handleOpenMap}
                                className="flex items-center justify-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-900 hover:premium-shadow hover:border-primary transition-all group"
                            >
                                <Map className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                                Interactive Map
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
                                flyToLat={pendingLat ?? undefined}
                                flyToLng={pendingLng ?? undefined}
                            />
                        </div>

                        {pendingLat !== null && (
                            <p className="text-xs text-center text-gray-400 -mt-1 pb-2">
                                📍 <span className="font-semibold text-emerald-600">{pendingLat.toFixed(4)}, {pendingLng?.toFixed(4)}</span>
                            </p>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
                            <button onClick={handleGpsInMap} disabled={isLocating} className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 border border-emerald-200 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors">
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

