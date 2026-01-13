"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User as UserIcon,
  Mail,
  MapPin,
  Edit2,
  Calendar,
  Camera,
  ShieldCheck,
  Check,
  X,
  Phone,
  Upload,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { updateUserProfileAction } from "@/app/actions/users/user-profile-actions";
import toast from "react-hot-toast";
import { Address } from "./page";

// --- Types ---
const ClientProfile = () => {
  const { user: currentUser, setUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name?: string;
    phone_number?: number;
    address?: Address[];
    profilePictureUrl?: string | null;
  }>({});

  useEffect(() => {
    if (!currentUser) return;

    setPreviewImage(currentUser.profileImageUrl || null);
  }, [currentUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, profilePicture: file }));

    const preview = URL.createObjectURL(file);
    setPreviewImage(preview);
  };

  const handleSave = async () => {
    if (!currentUser) return;

    // 1️⃣ Optimistic update
    setUser((prev) =>
      prev
        ? {
            ...prev,
            name: formData.name ?? prev.name,
            phone_number: formData.phone_number ?? prev.phone_number,
            address: formData.address ?? prev.address,
            profileImageUrl: previewImage ?? prev.profileImageUrl,
          }
        : prev
    );

    setIsEditing(false);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone_number,
        address: formData.address,
        profilePicture: formData.profilePictureUrl,
      };

      const response = await updateUserProfileAction(currentUser.id, payload);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  useEffect(() => {}, [handleSave]);

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        phone_number: currentUser.phone_number,
        address: currentUser.address,
      });

      setPreviewImage(currentUser.profileImageUrl || null);
    }
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-[#1B4332] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 relative group">
          {/* Header Banner */}
          <div className="h-48 bg-[#1B4332] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#DC2626] opacity-10 blur-[100px] rounded-full"></div>
          </div>

          <div className="px-8 pb-8 relative">
            {/* Avatar & Main Info Row */}
            <div className="flex flex-col sm:flex-row items-end -mt-20 mb-6 gap-6">
              {/* Profile Picture */}
              <div className="relative group/avatar">
                <div className="w-40 h-40 rounded-full border-[6px] border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center relative">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={64} className="text-gray-300" />
                  )}

                  {/* Image Edit Overlay (Visible when editing) */}
                  {isEditing && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center cursor-pointer transition-opacity opacity-100"
                    >
                      <Upload size={24} className="text-white mb-1" />
                      <span className="text-white text-xs font-bold uppercase tracking-wide">
                        Change
                      </span>
                    </div>
                  )}
                </div>

                {/* Camera Icon Trigger (Visible when NOT editing, for quick access) */}
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute bottom-2 right-2 bg-white p-2.5 rounded-full shadow-md text-gray-600 hover:text-[#DC2626] border border-gray-100 hover:scale-110 transition-all duration-200 z-10"
                  >
                    <Camera size={18} />
                  </button>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Name & Role */}
              <div className="flex-1 pb-2 text-center sm:text-left w-full">
                {isEditing ? (
                  <div className="mb-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      className="text-3xl font-bold text-[#1B4332] w-full border-b-2 border-gray-200 focus:border-[#1B4332] outline-none bg-transparent py-1 placeholder-gray-300"
                      placeholder="Enter your name"
                    />
                  </div>
                ) : (
                  <h1 className="text-3xl font-bold text-[#1B4332] mb-1">
                    {currentUser.name}
                  </h1>
                )}

                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
                    <ShieldCheck size={14} />
                    {currentUser.role}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} /> Joined {currentUser.createdAt}
                  </span>
                </div>
              </div>

              {/* Edit/Save Actions */}
              <div className="mb-2 w-full sm:w-auto flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2.5 bg-white text-gray-500 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
                    >
                      <X size={18} /> Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-2.5 bg-[#1B4332] text-white font-bold rounded-xl hover:bg-[#143225] transition-colors shadow-lg shadow-green-900/20 flex items-center gap-2"
                    >
                      <Check size={18} /> Save
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      if (!currentUser) return;
                      setFormData({
                        name: currentUser.name,
                        phone_number: currentUser.phone_number,
                        address: currentUser.address,
                        profilePictureUrl: currentUser.profileImageUrl ?? null,
                      });
                      setPreviewImage(currentUser.profileImageUrl || null);
                      setIsEditing(true);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-[#1B4332] font-semibold rounded-xl border border-gray-200 shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full mb-8"></div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Address Section */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={14} /> Primary Address
                </label>
                <div
                  className={`p-5 rounded-2xl border flex items-start gap-4 transition-colors group/card ${
                    isEditing
                      ? "bg-white border-[#1B4332] shadow-md ring-4 ring-[#1B4332]/5"
                      : "bg-gray-50 border-gray-100 hover:border-green-200"
                  }`}
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#DC2626] shadow-sm group-hover/card:scale-110 transition-transform flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <textarea
                        value={formData.address?.[0]?.street ?? ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: [
                              {
                                id:
                                  prev.address?.[0]?.id ?? crypto.randomUUID(),
                                label: "Home",
                                street: e.target.value,
                                city: "",
                                zip: "",
                                isDefault: true,
                              },
                            ],
                          }))
                        }
                        rows={3}
                      />
                    ) : (
                      <>
                        <p className="font-semibold text-gray-900 leading-relaxed">
                          {currentUser.address &&
                          currentUser.address.length > 0 ? (
                            currentUser.address.map((addr) => (
                              <p key={addr.id}>
                                {addr.street}
                                {addr.isDefault && " (Default)"}
                              </p>
                            ))
                          ) : (
                            <p>—</p>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Visible to workers only after you hire them.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Email & Phone Section */}
              <div className="space-y-4">
                {/* Email (Read Only usually, but displayed nicely) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Mail size={14} /> Contact Email
                  </label>
                  <div
                    className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4 opacity-75 cursor-not-allowed"
                    title="Email cannot be changed"
                  >
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1B4332] shadow-sm">
                      <Mail size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-gray-900 truncate">
                        {currentUser.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        Primary account email
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone (Editable) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Phone size={14} /> Phone Number
                  </label>
                  <div
                    className={`p-4 rounded-2xl border flex items-center gap-4 transition-colors ${
                      isEditing
                        ? "bg-white border-[#1B4332] shadow-md ring-4 ring-[#1B4332]/5"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1B4332] shadow-sm">
                      <Phone size={20} />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number || ""}
                          onChange={handleInputChange}
                          className="w-full font-semibold text-gray-900 bg-transparent outline-none placeholder-gray-400"
                          placeholder="+1 (000) 000-0000"
                        />
                      ) : (
                        <p className="font-semibold text-gray-900">
                          {currentUser.phone_number}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Banner */}
        <div className="bg-[#1B4332] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg text-white">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Have a project in mind?</h3>
            <p className="text-green-100 text-sm max-w-md">
              Post a request today and get matched with top-rated professionals
              in your area.
            </p>
          </div>
          <button className="px-8 py-3 bg-[#DC2626] hover:bg-[#b91c1c] text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 whitespace-nowrap">
            Post a Job Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
