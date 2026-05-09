import React, { useState, useEffect } from "react";
import { X, MapPin, Loader2, Save, Map as MapIcon } from "lucide-react";
import { Address } from "@/shared/types/addressType";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/userStore";
import { addUSerAddressAction } from "@/app/actions/users/user-profile-actions";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(
  () => import("./LocationPicker").then((mod) => mod.LocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 text-gray-400">
        Loading Map...
      </div>
    ),
  },
);

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => Promise<void>;
  initialData?: Address | null;
  mode?: "add" | "edit";
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = "add",
}) => {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMap, setShowMap] = useState(false);
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
      if (mode === "edit" && initialData) {
        setFormData(initialData);
      } else {
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
      setShowMap(false);
    }
  }, [isOpen, initialData, mode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    // Handle checkbox separately if needed
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch address");
      }

      const data = await res.json();
      const address = data.address || {};

      const street = [
        address.house_number,
        address.road ||
        address.pedestrian ||
        address.footway ||
        address.residential ||
        address.path ||
        address.neighbourhood ||
        address.suburb,
      ]
        .filter(Boolean)
        .join(" ");

      setFormData((prev) => ({
        ...prev,
        lat,
        lng,
        street,
        city: address.city || address.town || address.village || "",
        state: address.state || "",
        country: address.country || "",
        zip: address.postcode || "",
      }));

      // Automatically open address fields if hidden or ensure they are visible
      // (Currently they are always visible)
    } catch (err: unknown) {
      console.error("Reverse geocoding error:", err);
      toast.error("Unable to fetch address details for this location");
    }
  };

  const fetchLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }

    try {
      setIsLoadingLocation(true);

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        },
      );

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      await reverseGeocode(lat, lng);
      toast.success("Location detected successfully");
    } catch (err: unknown) {
      console.error("GPS error:", err);
      toast.error("Unable to fetch location");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleMapLocationSelect = async (lat: number, lng: number) => {
    // Determine complexity: do we want to reverse geocode on every click?
    // Yes, for better UX.
    setIsLoadingLocation(true);
    await reverseGeocode(lat, lng);
    setIsLoadingLocation(false);
  };

  const { user, setUser } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.lat || !formData.lng) {
      toast.error("Please select a location");
      return;
    }

    if (!user) {
      toast.error("User not found");
      return;
    }

    setIsSaving(true);

    try {
      await onSave(formData as Address);
      onClose();
    } catch (error: unknown) {
      console.error("Failed to save address: ", error);
      toast.error("Failed to save address");
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
            {mode === "edit" ? "Edit Address" : "Add New Address"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto max-h-[70vh]"
        >
          {/* Location Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={fetchLocation}
              disabled={isLoadingLocation}
              className="flex flex-col items-center justify-center gap-2 py-4 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition-colors border border-blue-200 text-sm"
            >
              {isLoadingLocation ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <MapPin size={24} />
              )}
              Fetch My Location
            </button>
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl font-bold transition-colors border text-sm ${showMap
                ? "bg-[#1B4332] text-white border-[#1B4332]"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                }`}
            >
              <MapIcon size={24} />
              {showMap ? "Hide Map" : "Pick from Map"}
            </button>
          </div>

          {/* Map Area */}
          {showMap && (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <p className="text-xs text-gray-500 mb-2">
                Click on the map to set your location
              </p>
              <LocationPicker
                onLocationSelect={handleMapLocationSelect}
                initialLat={formData.lat}
                initialLng={formData.lng}
              />
            </div>
          )}

          <div className="h-px bg-gray-100 my-2" />

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
              Label
            </label>
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
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
              Street Address
            </label>
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
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                City
              </label>
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
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                Zip Code
              </label>
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
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                State
              </label>
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
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                Country
              </label>
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
            <label
              htmlFor="isDefault"
              className="text-sm font-medium text-gray-700 select-none"
            >
              Set as default address
            </label>
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
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {mode === "edit" ? "Update Address" : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
};
