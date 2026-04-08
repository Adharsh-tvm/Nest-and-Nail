"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Search, MapPin, Navigation, X, Map } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Category } from '@/shared/types/categoryTypes';

// Dynamically import LocationPicker to avoid SSR issues with Leaflet
const LocationPicker = dynamic(
    () => import('@/app/components/containers/layout/LocationPicker').then(m => m.LocationPicker),
    { ssr: false, loading: () => <div className="h-[350px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Loading map...</div> }
);

interface WorkerSearchFilterProps {
    categories?: Category[];
    activeCategory?: string;
}

function WorkerSearchFilterInner({ categories = [], activeCategory }: WorkerSearchFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchKeyword, setSearchKeyword] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [locationText, setLocationText] = useState('');
    const [showMapModal, setShowMapModal] = useState(false);
    const [isOnlineFilter, setIsOnlineFilter] = useState(false);

    // Pending picked location from map (not yet applied)
    const [pendingLat, setPendingLat] = useState<number | null>(null);
    const [pendingLng, setPendingLng] = useState<number | null>(null);

    useEffect(() => {
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        if (lat && lng) {
            setLocationText(`${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`);
        } else {
            setLocationText('');
        }
        // Sync isOnline state from URL
        setIsOnlineFilter(searchParams.get('isOnline') === 'true');
        // Sync search keyword from URL
        setSearchKeyword(searchParams.get('search') || '');
    }, [searchParams]);

    // Get location via browser GPS — applies directly (used from filter bar)
    const handleGetLocation = () => {
        setIsLocating(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    applyLocation(latitude, longitude);
                    setIsLocating(false);
                },
                () => {
                    alert("Unable to get your location. Please check your browser permissions.");
                    setIsLocating(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser");
            setIsLocating(false);
        }
    };

    // GPS for map modal — only moves the pin, does not apply to URL yet
    const handleGpsForMap = () => {
        setIsLocating(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPendingLat(latitude);
                    setPendingLng(longitude);
                    setIsLocating(false);
                },
                () => {
                    alert("Unable to get your location. Please check your browser permissions.");
                    setIsLocating(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser");
            setIsLocating(false);
        }
    };

    // Apply a location to URL
    const applyLocation = (lat: number, lng: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('lat', lat.toString());
        params.set('lng', lng.toString());
        setLocationText(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        router.push(`?${params.toString()}`);
    };

    const handleClearLocation = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('lat');
        params.delete('lng');
        setLocationText('');
        router.push(`?${params.toString()}`);
    };

    // Submit keyword search to URL
    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const params = new URLSearchParams(searchParams.toString());
            if (searchKeyword.trim()) {
                params.set('search', searchKeyword.trim());
            } else {
                params.delete('search');
            }
            router.push(`?${params.toString()}`);
        }
    };

    // Toggle online-only filter
    const handleToggleOnline = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (!isOnlineFilter) {
            params.set('isOnline', 'true');
        } else {
            params.delete('isOnline');
        }
        router.push(`?${params.toString()}`);
    };

    const handleOpenMap = () => {
        // Initialize pending coords from current URL params
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        setPendingLat(lat ? parseFloat(lat) : null);
        setPendingLng(lng ? parseFloat(lng) : null);
        setShowMapModal(true);
    };

    const handleMapSelect = (lat: number, lng: number) => {
        setPendingLat(lat);
        setPendingLng(lng);
    };

    const handleApplyMapLocation = () => {
        if (pendingLat !== null && pendingLng !== null) {
            applyLocation(pendingLat, pendingLng);
        }
        setShowMapModal(false);
    };

    return (
        <>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center mb-10 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row w-full gap-2 text-sm">
                    {/* Search Input */}
                    <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200">
                        <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            placeholder="Search by name... (press Enter)"
                            className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400"
                        />
                        {searchKeyword.trim() && (
                            <button
                                onClick={() => {
                                    setSearchKeyword('');
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.delete('search');
                                    router.push(`?${params.toString()}`);
                                }}
                                className="ml-1 shrink-0 text-gray-400 hover:text-red-500"
                                title="Clear search"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Location Filter */}
                    <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200 gap-2">
                        <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                        <button
                            onClick={handleOpenMap}
                            className="flex-1 text-left text-gray-400 hover:text-gray-600 truncate"
                        >
                            {locationText || 'Pick location on map...'}
                        </button>

                        {/* Clear button */}
                        {locationText && (
                            <button
                                onClick={handleClearLocation}
                                className="shrink-0 text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors"
                                title="Clear location"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        {/* GPS button */}
                        <button
                            onClick={handleGetLocation}
                            disabled={isLocating}
                            className="shrink-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-1.5 rounded-md transition-colors"
                            title="Use my current location"
                        >
                            {isLocating ? (
                                <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin block" />
                            ) : (
                                <Navigation className="w-4 h-4" />
                            )}
                        </button>

                        {/* Map picker button */}
                        <button
                            onClick={handleOpenMap}
                            className="shrink-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-1.5 rounded-md transition-colors"
                            title="Pick on map"
                        >
                            <Map className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Filter Pills */}
            {categories.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-5 -mt-5">
                    {/* 'All' pill to clear category filter */}
                    <button
                        onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.delete('category');
                            router.push(`?${params.toString()}`);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                            !activeCategory
                                ? 'bg-gray-800 text-white border-gray-800 shadow-sm'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
                        }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                if (activeCategory === cat.name) {
                                    params.delete('category');
                                } else {
                                    params.set('category', cat.name);
                                }
                                router.push(`?${params.toString()}`);
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                activeCategory === cat.name
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-400 hover:text-emerald-600'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Online Only Filter Toggle */}
            <div className="flex items-center justify-center gap-3 max-w-4xl mx-auto mb-6 -mt-6">
                <button
                    onClick={handleToggleOnline}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        isOnlineFilter
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-400 hover:text-emerald-600'
                    }`}
                >
                    <span className={`w-2 h-2 rounded-full ${ isOnlineFilter ? 'bg-white' : 'bg-emerald-400'}`} />
                    Online Only
                </button>
            </div>

            {/* Map Modal */}
            {showMapModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Pick a Location</h2>
                                <p className="text-sm text-gray-500 mt-0.5">Click anywhere on the map to set your location for finding nearby workers</p>
                            </div>
                            <button
                                onClick={() => setShowMapModal(false)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Map */}
                        <div className="px-6 pt-4 pb-2">
                            <LocationPicker
                                onLocationSelect={handleMapSelect}
                                initialLat={pendingLat ?? undefined}
                                initialLng={pendingLng ?? undefined}
                            />
                            {pendingLat !== null && pendingLng !== null && (
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Selected: <span className="font-semibold text-emerald-600">{pendingLat.toFixed(5)}, {pendingLng.toFixed(5)}</span>
                                </p>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100">
                            <button
                                onClick={handleGpsForMap}
                                disabled={isLocating}
                                className="flex items-center gap-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors border border-emerald-200"
                            >
                                {isLocating ? (
                                    <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin block" />
                                ) : (
                                    <Navigation className="w-4 h-4" />
                                )}
                                Use my GPS location
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowMapModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApplyMapLocation}
                                    disabled={pendingLat === null || pendingLng === null}
                                    className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                                >
                                    Apply Location
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Wrapper with Suspense for useSearchParams
export default function WorkerSearchFilter({ categories, activeCategory }: WorkerSearchFilterProps) {
    return (
        <Suspense fallback={<div className="h-16 bg-white rounded-2xl mb-10 max-w-4xl mx-auto animate-pulse border border-gray-100" />}>
            <WorkerSearchFilterInner categories={categories} activeCategory={activeCategory} />
        </Suspense>
    );
}
