import React, { useState, useEffect } from "react";
import { X, MapPin, Loader2, Save } from "lucide-react";
import { Address, AddressLabel } from "@/shared/types/addressType";
import toast from "react-hot-toast";

interface AddAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: Address) => Promise<void>;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<Address>>({
        label: "HOME",
        street: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        lat: 0,
        lng: 0,
        isDefault: false,
    });

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                label: "HOME",
                street: "",
                city: "",
                state: "",
                country: "",
                zip: "",
                lat: 0,
                lng: 0,
                isDefault: false,
            });
        }
    }, [isOpen]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        // Handle checkbox separately if needed, though for now isDefault is likely a checkbox
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const fetchLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Reverse geocoding using OpenStreetMap Nominatim
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    if (data && data.address) {
                        setFormData((prev) => ({
                            ...prev,
                            lat: latitude,
                            lng: longitude,
                            street: data.address.road || data.address.pedestrian || "",
                            city: data.address.city || data.address.town || data.address.village || "",
                            state: data.address.state || "",
                            country: data.address.country || "",
                            zip: data.address.postcode || "",
                        }));
                        toast.success("Location fetched successfully");
                    } else {
                        // Fallback if address lookup fails but we have coords
                        setFormData((prev) => ({
                            ...prev,
                            lat: latitude,
                            lng: longitude
                        }));
                        toast.success("Coordinates fetched. Please fill in address details.");
                    }
                } catch (error) {
                    console.error("Error fetching address:", error);
                    // Set coords anyway even if reverse geo fails
                    setFormData((prev) => ({
                        ...prev,
                        lat: latitude,
                        lng: longitude
                    }));
                    toast.error("Could not fetch address details, but coordinates were saved.");
                } finally {
                    setIsLoadingLocation(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast.error("Unable to retrieve your location");
                setIsLoadingLocation(false);
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.street || !formData.city || !formData.zip) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSaving(true);
        try {
            await onSave(formData as Address);
            onClose();
        } catch (error) {
            console.error("Failed to save address:", error);
            // Toast handled by parent usually, or we can add one here
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <MapPin size={20} className="text-[#1B4332]" />
                        Add New Address
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                    {/* GPS Fetch Button */}
                    <button
                        type="button"
                        onClick={fetchLocation}
                        disabled={isLoadingLocation}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                        {isLoadingLocation ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <MapPin size={20} />
                        )}
                        {isLoadingLocation ? "Fetching Location..." : "Fetch Current Location (GPS)"}
                    </button>

                    <div className="h-px bg-gray-100 my-2" />

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">Label</label>
                        <select
                            name="label"
                            value={formData.label}
                            onChange={handleInputChange}
                            className="w-full text-base p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#1B4332] outline-none bg-white"
                        >
                            <option value="HOME">Home</option>
                            <option value="WORK">Work</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">Street Address</label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            placeholder="123 Main St"
                            className="w-full text-base p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#1B4332] outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="New York"
                                className="w-full text-base p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#1B4332] outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">Zip Code</label>
                            <input
                                type="text"
                                name="zip"
                                value={formData.zip}
                                onChange={handleInputChange}
                                placeholder="10001"
                                className="w-full text-base p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#1B4332] outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="NY"
                                className="w-full text-base p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#1B4332] outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                placeholder="USA"
                                className="w-full text-base p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#1B4332] outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="isDefault"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#1B4332] focus:ring-[#1B4332] border-gray-300 rounded"
                        />
                        <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 select-none">Set as default address</label>
                    </div>
                </form>

                <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="px-6 py-2 bg-[#1B4332] text-white rounded-lg text-sm font-bold hover:bg-[#143326] transition-colors flex items-center gap-2"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Address
                    </button>
                </div>
            </div>
        </div>
    );
};
