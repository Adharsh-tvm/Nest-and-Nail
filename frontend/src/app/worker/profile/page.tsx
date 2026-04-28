"use client";
import { useRouter } from "next/navigation";

import React, { useState, useEffect, useRef } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Calendar,
  ShieldCheck,
  Briefcase,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Eye,
  Save,
  X,
  Plus,
  Lock,
  CreditCard,
  Settings,
  LogOut,
  MoreVertical,
  Wallet as WalletIcon,
  Bell,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ExternalLink,
  Camera,
  Upload,
  Trash2,
  SailboatIcon,
  Calendar1,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { updateUserProfileAction } from "@/app/actions/users/user-profile-actions";
import { updateUserSkillsAction } from "@/app/actions/users/user-skills-action";
import {
  addUSerAddressAction,
  editUserAddressAction,
  deleteUserAddressAction
} from "@/app/actions/users/user-profile-actions";
import {
  updateUserCategoriesAction,
  fetchCategoriesAction,
} from "@/app/actions/users/user-categories-action";
import toast from "react-hot-toast";
import { VerificationStatus } from "@/shared/enums/authEnums";
import { User } from "@/shared/types/userTypes";
import { Category } from "@/shared/types/categoryTypes";
import { AddAddressModal } from "@/app/components/containers/layout/AddAddressModal";
import { ChangePasswordModal } from "@/app/components/containers/auth/ChangePasswordModal";
import { getWalletBalanceAction } from "@/app/actions/client/wallet-actions";

import { Address } from "@/shared/types/addressType";
import { blockWorkerDatesAction, getWorkerBlockedDatesAction } from "@/app/actions/worker/slot-actions";
import { SlotType, SlotAvailability } from "@/shared/types/serviceTypes";

// --- Types ---

export type Tab = "profile" | "addresses" | "slot" | "wallet" | "settings";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  status: "completed" | "pending";
};

// --- Sub-Components ---

const StatusBadge = ({ status }: { status: VerificationStatus }) => {
  switch (status) {
    case "VERIFIED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]/20 uppercase tracking-wider">
          <ShieldCheck size={12} /> Verified
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 uppercase tracking-wider">
          <Clock size={12} /> Pending
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wider">
          Unverified
        </span>
      );
  }
};

// --- Document Viewer Modal ---

const DocumentViewerModal = ({
  src,
  onClose,
}: {
  src: string | null;
  onClose: () => void;
}) => {
  if (!src) return null;

  const isPdf =
    src.toLowerCase().endsWith(".pdf") || src.includes("application/pdf");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText size={20} className="text-[#1B4332]" />
            Document Viewer
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 bg-gray-50 p-4 overflow-auto flex items-center justify-center">
          {isPdf ? (
            <iframe
              src={src}
              className="w-full h-full rounded-lg shadow-sm border border-gray-200 bg-white"
              title="Document Viewer"
            />
          ) : (
            <img
              src={src}
              alt="Document"
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            />
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white rounded-lg font-medium hover:bg-[#143326] transition-colors"
          >
            <ExternalLink size={16} /> Open Original
          </a>
        </div>
      </div>
    </div>
  );
};

// --- Confirmation Modal ---

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-bold bg-[#1B4332] text-white rounded-lg hover:bg-[#143326] transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// --- View Components ---

interface ViewProps {
  user: User;
  setUser: (user: User) => void; // Updated to match store setter signature
}

const ProfileView: React.FC<ViewProps> = ({ user, setUser }) => {
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [isCategorySaveConfirmOpen, setIsCategorySaveConfirmOpen] =
    useState(false);
  const [formData, setFormData] = useState<User>(user);
  const [newSkill, setNewSkill] = useState("");
  const [viewingDocument, setViewingDocument] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    [],
  );

  useEffect(() => {
    fetchCategoriesAction()
      .then(setAvailableCategories)
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);

  // Removed redundant fetchWorkerCategoriesAction as categories are now loaded with user details


  // Sync formData when user prop updates (e.g. after image upload in parent)
  useEffect(() => {
    setFormData(user);
    if (user.profileImageUrl) {
      setProfilePicPreview(user.profileImageUrl);
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    user.profileImageUrl || null
  );
  const [selectedProfilePic, setSelectedProfilePic] = useState<File | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    if (isEditingDetails && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.filter((s) => s !== skill),
    }));
  };

  const handleSaveDetails = async () => {
    // 1. Optimistic Update
    setUser(formData);
    setIsEditingDetails(false);

    try {
      // 2. Prepare Payload
      const payload = {
        name: formData.name,
        phone: formData.phone_number,
        profilePicture: selectedProfilePic,
      };

      // 3. API Call
      const response = await updateUserProfileAction(user.id, payload);

      if (!response.success) {
        toast.error(response.message);
        // Revert on error could be implemented here
        return;
      }

      if (response.user) {
        setUser(response.user);
      }
      setSelectedProfilePic(null);

      toast.success("Profile details updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  const handleSaveSkills = async () => {
    // 1. Optimistic Update
    setUser(formData);
    setIsEditingSkills(false);

    try {
      const response = await updateUserSkillsAction(
        user.id,
        formData.skills || [],
      );

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success("Skills updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  const handleToggleCategory = (catId: string) => {
    const currentCats = formData.categories || [];
    if (currentCats.includes(catId)) {
      setFormData((prev) => ({
        ...prev,
        categories: currentCats.filter((c) => c !== catId),
      }));
    } else {
      if (currentCats.length >= 3) {
        toast.error("You can select up to 3 categories");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        categories: [...currentCats, catId],
      }));
    }
  };

  const handleSaveCategoriesClick = () => {
    setIsCategorySaveConfirmOpen(true);
  };

  const confirmSaveCategories = async () => {
    setIsCategorySaveConfirmOpen(false);
    // 1. Optimistic Update
    setUser(formData);
    setIsEditingCategories(false);

    try {
      const response = await updateUserCategoriesAction(
        user.id,
        formData.categories || [],
      );

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success("Categories updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  return (
    <>
      <DocumentViewerModal
        src={viewingDocument}
        onClose={() => setViewingDocument(null)}
      />

      <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2.5">
                <UserIcon size={20} className="text-[#1B4332]" /> Personal
                Details
              </h3>
              {isEditingDetails ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setFormData(user); // Reset to current user state
                      setProfilePicPreview(user.profileImageUrl || null);
                      setSelectedProfilePic(null);
                      setIsEditingDetails(false);
                    }}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDetails}
                    className="text-sm font-medium bg-[#1B4332] text-white px-4 py-2 rounded-md hover:bg-[#143326] transition-colors flex items-center gap-2"
                  >
                    <Save size={16} /> Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingDetails(true)}
                  className="text-sm font-medium text-gray-600 hover:text-[#1B4332] flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
                >
                  <Edit2 size={16} /> Edit
                </button>
              )}
            </div>

            <div className="p-8 grid sm:grid-cols-2 gap-8 relative">
              {/* Profile Picture Section */}
              <div className="sm:col-span-2 flex justify-center mb-6">
                <div className="relative group">
                  <div
                    onClick={handleAvatarClick}
                    className={`w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg relative ${isEditingDetails ? "cursor-pointer" : ""
                      }`}
                  >
                    {profilePicPreview ? (
                      <img
                        src={profilePicPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={() => setProfilePicPreview(null)}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1B4332] flex items-center justify-center text-white text-3xl font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Overlay for editing */}
                    {isEditingDetails && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Camera className="text-white" size={24} />
                      </div>
                    )}
                  </div>
                  {isEditingDetails && (
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleProfilePicChange}
                      accept="image/*"
                      className="hidden"
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">
                  Full Name
                </label>
                {isEditingDetails ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full text-base p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332] outline-none"
                  />
                ) : (
                  <p className="text-base font-medium text-gray-900">
                    {user.name}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">
                  Phone Number
                </label>
                {isEditingDetails ? (
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number || ""}
                    onChange={handleInputChange}
                    className="w-full text-base p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332] outline-none"
                  />
                ) : (
                  <p className="text-base font-medium text-gray-900">
                    {user.phone_number}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">
                  Email Address
                </label>
                <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-base text-gray-700">{user.email}</span>
                  <Lock size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2.5">
                <Briefcase size={20} className="text-[#1B4332]" /> Skills &
                Expertise
              </h3>
              {isEditingSkills ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setFormData(user); // Reset to current user state
                      setIsEditingSkills(false);
                    }}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSkills}
                    className="text-sm font-medium bg-[#1B4332] text-white px-4 py-2 rounded-md hover:bg-[#143326] transition-colors flex items-center gap-2"
                  >
                    <Save size={16} /> Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingSkills(true)}
                  className="text-sm font-medium text-gray-600 hover:text-[#1B4332] flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
                >
                  <Edit2 size={16} /> Edit
                </button>
              )}
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-3 mb-6">
                {(isEditingSkills ? formData.skills : user.skills)?.map(
                  (skill, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${isEditingSkills
                        ? "bg-white border-[#1B4332] text-[#1B4332]"
                        : "bg-[#1B4332]/5 border-[#1B4332]/10 text-[#1B4332]"
                        }`}
                    >
                      {skill}
                      {isEditingSkills && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ),
                )}
              </div>
              {isEditingSkills && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a new skill..."
                    className="flex-1 text-base p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#1B4332] outline-none"
                  />
                  <button
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Media & Docs */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2.5">
                <LayoutDashboard size={20} className="text-[#1B4332]" />{" "}
                Categories
              </h3>
              {isEditingCategories ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setFormData(user); // Reset
                      setIsEditingCategories(false);
                    }}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCategoriesClick}
                    className="text-sm font-medium bg-[#1B4332] text-white px-4 py-2 rounded-md hover:bg-[#143326] transition-colors flex items-center gap-2"
                  >
                    <Save size={16} /> Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingCategories(true)}
                  className="text-sm font-medium text-gray-600 hover:text-[#1B4332] flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
                >
                  <Edit2 size={16} /> Edit
                </button>
              )}
            </div>
            <ConfirmationModal
              isOpen={isCategorySaveConfirmOpen}
              onClose={() => setIsCategorySaveConfirmOpen(false)}
              onConfirm={confirmSaveCategories}
              title="Save Categories"
              message="Are you sure you want to save these categories? You can select up to 3 categories."
            />
            <div className="p-8">
              <div className="flex flex-wrap gap-3 mb-6">
                {(isEditingCategories ? formData.categories : user.categories)
                  ?.length > 0 ? (
                  (isEditingCategories
                    ? formData.categories
                    : user.categories
                  ).map((catId, i) => {
                    const category = availableCategories.find(
                      (c) => c.id === catId,
                    );
                    return (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border bg-[#1B4332]/5 border-[#1B4332]/10 text-[#1B4332]"
                      >
                        {category ? category.name : "Loading..."}
                        {isEditingCategories && (
                          <button
                            onClick={() => handleToggleCategory(catId)}
                            className="hover:text-red-500"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-gray-500 text-sm italic">
                    No categories selected
                  </span>
                )}
              </div>

              {isEditingCategories && (
                <div className="mt-6 border-t border-gray-50 pt-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
                    Available Categories
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {availableCategories.map((cat) => {
                      const isSelected = (formData.categories || []).includes(
                        cat.id,
                      );
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleToggleCategory(cat.id)}
                          className={`text-left px-4 py-2 rounded-lg text-sm transition-all border ${isSelected
                            ? "bg-[#1B4332] text-white border-[#1B4332]"
                            : "bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-200"
                            }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{cat.name}</span>
                            {isSelected && <CheckCircle2 size={14} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2.5">
                <FileText size={20} className="text-[#1B4332]" /> Documents
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {user.documents && user.documents.length > 0 ? (
                user.documents.slice(0, 4).map((doc, i) => (
                  <div
                    key={i}
                    onClick={() => setViewingDocument(doc)}
                    className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        Document {i + 1}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Click to view
                      </p>
                    </div>
                    <Eye
                      size={18}
                      className="text-gray-300 group-hover:text-[#1B4332] transition-colors"
                    />
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400 text-sm">
                  No documents uploaded
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const AddressesView: React.FC<ViewProps> = ({ user, setUser }) => {
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const router = useRouter();

  const handleSaveAddress = async (addressData: Address) => {
    // Determine if we are adding or editing
    const isEditing = !!editingAddress;
    const oldUser = user;

    // Optimistic Update
    let updatedAddresses = [...(user.address || [])];
    if (isEditing && editingAddress) {
      updatedAddresses = updatedAddresses.map((addr) =>
        addr.addressId === editingAddress.addressId ? { ...addressData, addressId: editingAddress.addressId } : addr
      );
    } else {
      updatedAddresses.push(addressData);
    }

    // Handle default address logic locally for optimistic update
    if (addressData.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({
        ...a,
        isDefault: a === addressData || (isEditing && a.addressId === editingAddress?.addressId)
      }));
    }

    setUser({ ...user, address: updatedAddresses });

    try {
      let response;
      if (isEditing && editingAddress?.addressId) {
        response = await editUserAddressAction(user.id, editingAddress.addressId, addressData);
      } else {
        response = await addUSerAddressAction(user.id, addressData);
      }

      if (!response.success) {
        setUser(oldUser);
        toast.error(response.message);
        return;
      }

      setUser(response.payload || oldUser);
      toast.success(isEditing ? "Address updated successfully" : "Address added successfully");
      router.refresh();
    } catch (err: any) {
      setUser(oldUser);
      toast.error(err.message || "Failed to save address");
    } finally {
      setEditingAddress(null);
    }
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setIsAddAddressOpen(true);
  };

  const handleDeleteClick = (addressId: string) => {
    setAddressToDelete(addressId);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    setIsDeleteConfirmOpen(false);

    const oldUser = user;
    const updatedAddresses = user.address?.filter(a => a.addressId !== addressToDelete);
    setUser({ ...user, address: updatedAddresses });

    try {
      const response = await deleteUserAddressAction(user.id, addressToDelete);
      if (!response.success) {
        setUser(oldUser);
        toast.error(response.message);
        return;
      }
      setUser(response.payload || oldUser);
      toast.success("Address deleted successfully");
      router.refresh();
    } catch (err: any) {
      setUser(oldUser);
      toast.error(err.message || "Failed to delete address");
    } finally {
      setAddressToDelete(null);
    }
  };

  return (
    <>
      <AddAddressModal
        isOpen={isAddAddressOpen}
        onClose={() => {
          setIsAddAddressOpen(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        initialData={editingAddress}
        mode={editingAddress ? "edit" : "add"}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDeleteAddress}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
      />

      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="grid md:grid-cols-2 gap-6">
          {user.address?.map((addr, index) => (
            <div
              key={`${addr.label}-${index}`}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#1B4332] transition-colors group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-600 group-hover:bg-[#1B4332]/10 group-hover:text-[#1B4332] transition-colors">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900">
                      {addr.label}
                    </h4>
                    {addr.isDefault && (
                      <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(addr)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      const id = addr.addressId || (addr as any)._id;
                      if (id) {
                        handleDeleteClick(id);
                      } else {
                        toast.error("Cannot delete: Address ID missing. Please refresh.");
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-base text-gray-600 pl-14 leading-relaxed">
                {addr.street}
                <br />
                {addr.city}, {addr.zip}
              </p>
            </div>
          ))}
          <button
            onClick={() => {
              setEditingAddress(null);
              setIsAddAddressOpen(true);
            }}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-[#1B4332] hover:text-[#1B4332] hover:bg-[#1B4332]/5 transition-all min-h-[160px]"
          >
            <Plus size={32} />
            <span className="text-sm font-bold mt-3">Add New Location</span>
          </button>
        </div>
      </div>
    </>
  );
};

const WalletView: React.FC<ViewProps> = ({ user }) => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecharging, setIsRecharging] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState<string>("1000");

  const fetchWallet = async () => {
    setIsLoading(true);
    const balanceRes = await getWalletBalanceAction();
    if (balanceRes.success && balanceRes.data) {
      setBalance(balanceRes.data.balance);
    }
    const { getTransactionsAction } = await import("@/app/actions/client/wallet-actions");
    const txRes = await getTransactionsAction();
    if (txRes.success && txRes.data) {
      setTransactions(txRes.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleRecharge = async () => {
    const amount = Number(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsRecharging(true);
    try {
      const { loadRazorpay } = await import("@/utils/loadRazorpay");
      const { createRechargeOrderAction, verifyRechargePaymentAction } = await import("@/app/actions/client/wallet-actions");

      const res = await loadRazorpay();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setIsRecharging(false);
        return;
      }

      const orderRes = await createRechargeOrderAction(amount);
      if (!orderRes.success) {
        toast.error(orderRes.error || "Failed to create recharge order");
        setIsRecharging(false);
        return;
      }

      const { orderId, amount: orderAmount, currency } = orderRes.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_YourKeyHere",
        amount: orderAmount.toString(),
        currency: currency,
        name: "Nest & Nail Wallet",
        description: "Wallet Recharge",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            setIsRecharging(true);
            const verifyRes = await verifyRechargePaymentAction({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount
            });

            if (verifyRes.success) {
              toast.success(`Successfully added ₹${amount} to wallet!`);
              fetchWallet();
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (error) {
            toast.error("An error occurred during verification.");
          } finally {
            setIsRecharging(false);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone_number?.toString()
        },
        theme: { color: "#1B4332" },
        modal: {
          ondismiss: function () {
            setIsRecharging(false);
            toast.error("Payment was cancelled.");
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        toast.error(response.error?.description || "Payment failed");
        setIsRecharging(false);
      });
      paymentObject.open();

    } catch (err: any) {
      toast.error(err.message || "An error occurred");
      setIsRecharging(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="lg:col-span-1">
        <div className="bg-gradient-to-br from-[#1B4332] to-[#0D2E21] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-emerald-100/80 uppercase tracking-widest">
                  Total Balance
                </p>
                <h2 className="text-4xl font-bold mt-2 tracking-tight">
                  {isLoading ? "..." : `₹${balance.toLocaleString()}`}
                </h2>
              </div>
              <WalletIcon className="text-emerald-400/20" size={40} />
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex bg-white/10 p-1 rounded-lg border border-white/20">
                <span className="flex items-center justify-center px-3 text-white/70 font-bold">₹</span>
                <input 
                  type="number" 
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-full bg-transparent text-white placeholder-white/50 outline-none font-bold"
                />
              </div>
              <button 
                onClick={handleRecharge}
                disabled={isRecharging}
                className="w-full bg-white text-[#1B4332] py-3 rounded-lg text-sm font-bold text-center shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isRecharging ? "Processing..." : "Add Money to Wallet"}
              </button>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-black/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2.5">
           <CreditCard size={20} className="text-[#1B4332]" />
            Recent Transactions
          </h3>
        </div>
        <div className="p-0 flex flex-col h-full">
          {isLoading ? (
            <div className="p-8 flex items-center justify-center text-center h-full min-h-[250px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4332]"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[250px]">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <WalletIcon size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No recent transactions</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {transactions.map((tx: any, idx: number) => (
                <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${tx.type === "CREDIT" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                       {tx.type === "CREDIT" ? <WalletIcon size={20} /> : <CreditCard size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 capitalize">
                        {tx.source.replace("_", " ").toLowerCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold ${tx.type === "CREDIT" ? "text-green-600" : "text-gray-900"}`}>
                    {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const SettingsView: React.FC<ViewProps> = ({ user, setUser }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleToggleOnline = async () => {
    if (isUpdating) return;
    setIsUpdating(true);

    const newStatus = !user.isOnline;

    // 1. Optimistic Update
    const oldStatus = user.isOnline;
    setUser({ ...user, isOnline: newStatus });

    try {
      // 2. Server Action
      const response = await updateUserProfileAction(user.id, {
        isOnline: newStatus,
      });

      if (!response.success) {
        // Revert on failure
        setUser({ ...user, isOnline: oldStatus });
        toast.error(response.message);
        return;
      }
      toast.success(`Status updated to ${newStatus ? "Online" : "Offline"}`);
    } catch (err: any) {
      setUser({ ...user, isOnline: oldStatus });
      toast.error(err.message || "Status update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div
              className={`p-3 rounded-lg ${user.isOnline ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
            >
              <LayoutDashboard size={24} />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">
                Availability Status
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {user.isOnline
                  ? "You are currently online and visible"
                  : "You are currently offline and hidden"}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleOnline}
            disabled={isUpdating}
            className={`w-12 h-7 rounded-full relative transition-colors ${user.isOnline ? "bg-[#1B4332]" : "bg-gray-200"
              } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span
              className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${user.isOnline ? "translate-x-5" : "translate-x-0"
                }`}
            />
          </button>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Bell size={24} />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">Notifications</p>
              <p className="text-sm text-gray-500 mt-1">
                Job alerts and updates
              </p>
            </div>
          </div>
          <div className="w-12 h-7 rounded-full bg-[#1B4332] relative cursor-pointer">
            <span className="absolute top-1 left-1 bg-white w-5 h-5 rounded-full translate-x-5" />
          </div>
        </div>
        <button 
          onClick={() => setIsPasswordModalOpen(true)}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left group"
        >
          <div className="flex items-center gap-5">
            <div className="p-3 bg-gray-100 text-gray-600 rounded-lg group-hover:bg-gray-200">
              <Lock size={24} />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">Change Password</p>
              <p className="text-sm text-gray-500 mt-1">
                Change password and security settings
              </p>
            </div>
          </div>
          <ChevronRight
            size={20}
            className="text-gray-400 group-hover:text-gray-600"
          />
        </button>
      </div>
      <div className="mt-8 flex justify-center">
        <button className="text-red-600 hover:text-red-700 text-sm font-bold flex items-center gap-2.5 px-6 py-3 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
    <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </>
  );
};

const SlotView: React.FC<ViewProps> = ({ user, setUser }) => {
  const [selectedDates, setSelectedDates] = useState<Record<string, SlotType>>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<Record<string, SlotAvailability>>({});
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [isBlockConfirmOpen, setIsBlockConfirmOpen] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const viewYear = currentMonth.getFullYear();
  const viewMonth = currentMonth.getMonth();

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const toDateKey = (y: number, m: number, d: number) => {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const loadAvailability = async () => {
    if (!user.id) return;
    setIsLoadingDates(true);
    try {
      const response = await getWorkerBlockedDatesAction();
      if (response.success && response.payload) {
        const payloadData: Array<{ date: string | Date; slotType: string; isBooked: boolean; isAvailable: boolean }> = response.payload;
        
        const formattedData: Record<string, SlotAvailability> = {};
        
        payloadData.forEach(slot => {
          const d = new Date(slot.date);
          const key = toDateKey(d.getFullYear(), d.getMonth(), d.getDate());
          
          formattedData[key] = {
            isBooked: slot.isBooked,
            fullDayAvailable: slot.isAvailable,
            morningAvailable: slot.isAvailable,
            eveningAvailable: slot.isAvailable
          };
        });

        setAvailabilityData(formattedData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingDates(false);
    }
  };

  useEffect(() => {
    loadAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewYear, viewMonth, user.id]);

  const handleDateClick = (day: number) => {
    const key = toDateKey(viewYear, viewMonth, day);
    const dateObj = new Date(viewYear, viewMonth, day);
    
    const isBooked = availabilityData[key]?.isBooked;
    const isUnavailable = !isBooked && availabilityData[key] && !availabilityData[key].fullDayAvailable;
    const isDisabled = dateObj < today || !!isBooked || !!isUnavailable;
    if (isDisabled) return;

    setSelectedDates(prev => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = SlotType.FULL_DAY;
      }
      return next;
    });
  };

  const handleBlockDates = async () => {
    const dates = Object.keys(selectedDates);
    if (dates.length === 0) {
      toast.error("Please select dates to block");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await blockWorkerDatesAction(dates, [SlotType.FULL_DAY]);
      if (response.success) {
        toast.success("Dates successfully blocked.");
        setSelectedDates({});
        await loadAvailability();
      } else {
        toast.error(response.message || "Failed to block dates");
      }
    } catch (e: any) {
      toast.error(e.message || "Error blocking dates");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <ConfirmationModal
          isOpen={isBlockConfirmOpen}
          onClose={() => setIsBlockConfirmOpen(false)}
          onConfirm={() => {
            setIsBlockConfirmOpen(false);
            handleBlockDates();
          }}
          title="Block Dates"
          message={`Are you sure you want to block the ${Object.keys(selectedDates).length} selected date(s)? Clients will not be able to book you on these dates.`}
        />
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <Calendar1 size={24} className="text-[#1B4332]" /> Manage Unavailability
          </h3>
          <button 
            onClick={() => setIsBlockConfirmOpen(true)}
            disabled={isSubmitting || Object.keys(selectedDates).length === 0}
            className="bg-[#1B4332] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#143326] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? <span className="animate-pulse">Saving...</span> : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
        <p className="text-gray-500 mb-8 border-b border-gray-100 pb-6">
          Select dates when you are unavailable. Clients will not be able to book services on these days.
        </p>

        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded-xl">
            <button 
              onClick={() => setCurrentMonth(new Date(viewYear, viewMonth - 1, 1))}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"
            >
              <ChevronLeft size={20} />
            </button>
            <h4 className="font-bold text-lg text-gray-900">
              {currentMonth.toLocaleString("default", { month: "long" })} {viewYear}
            </h4>
            <button 
              onClick={() => setCurrentMonth(new Date(viewYear, viewMonth + 1, 1))}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-xs font-bold text-gray-400 py-2 uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              
              const dateObj = new Date(viewYear, viewMonth, day);
              const key = toDateKey(viewYear, viewMonth, day);
              const isPast = dateObj < today;
              const isSelected = !!selectedDates[key];
              const isBooked = availabilityData[key]?.isBooked;
              const isUnavailable = !isBooked && availabilityData[key] && !availabilityData[key].fullDayAvailable;
              const isDisabled = isPast || !!isBooked || !!isUnavailable;

              return (
                <button
                  key={key}
                  disabled={isDisabled}
                  onClick={() => handleDateClick(day)}
                  className={`
                    aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all relative
                    ${isPast ? "text-gray-300 bg-gray-50/50 cursor-not-allowed" : ""}
                    ${!isPast && isBooked ? "text-blue-400 bg-blue-50 cursor-not-allowed" : ""}
                    ${!isPast && isUnavailable && !isBooked ? "text-gray-400 bg-gray-100 cursor-not-allowed" : ""}
                    ${!isDisabled && !isSelected ? "text-gray-700 hover:bg-[#1B4332]/5 hover:text-[#1B4332] cursor-pointer" : ""}
                    ${!isDisabled && isSelected ? "bg-red-50 text-red-600 ring-2 ring-red-400 ring-offset-1 font-bold shadow-sm cursor-pointer" : "border border-transparent"}
                  `}
                >
                  <span className="z-10">{day}</span>
                  {isBooked && !isPast && <span className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-blue-400"></span>}
                  {isUnavailable && !isPast && !isBooked && <span className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-gray-400"></span>}
                  {isSelected && !isDisabled && <span className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                </button>
              )
            })}
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-500 bg-gray-50 py-3 rounded-xl flex-wrap">
             <div className="flex items-center gap-2 font-medium">
               <span className="w-3.5 h-3.5 rounded-md bg-white flex items-end justify-center pb-0.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span></span> 
               Blocked by You
             </div>
             <div className="flex items-center gap-2 font-medium">
               <span className="w-3.5 h-3.5 rounded-md bg-white flex items-end justify-center pb-0.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span></span> 
               Booked by Client
             </div>
             <div className="flex items-center gap-2 font-medium">
               <span className="w-3.5 h-3.5 rounded-md bg-red-50 ring-1 ring-red-400 inline-block shadow-sm flex items-end justify-center pb-0.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span></span> 
               Selected to Block
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Layout ---

const UserProfile = () => {
  // Using global store instead of local Mock state
  const { user: currentUser, setUser } = useUserStore();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // File Input Ref for Header Image Upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    const preview = URL.createObjectURL(file);

    // 1. Optimistic Update
    const oldImage = currentUser.profileImageUrl;
    setUser({ ...currentUser, profileImageUrl: preview });

    try {
      // 2. Server Action
      const response = await updateUserProfileAction(currentUser.id, {
        profilePicture: file,
      });

      if (!response.success) {
        // Revert on failure
        setUser({ ...currentUser, profileImageUrl: oldImage });
        toast.error(response.message);
        return;
      }
      toast.success("Profile picture updated!");
    } catch (err: any) {
      setUser({ ...currentUser, profileImageUrl: oldImage });
      toast.error(err.message || "Image upload failed");
    }
  };

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleToggleOnline = async () => {
    if (isUpdatingStatus || !currentUser) return;
    setIsUpdatingStatus(true);
    const safeUser = currentUser as unknown as User;

    const newStatus = !safeUser.isOnline;

    // 1. Optimistic Update
    const oldStatus = safeUser.isOnline;
    setUser({ ...currentUser, isOnline: newStatus } as any);

    try {
      // 2. Server Action
      const response = await updateUserProfileAction(currentUser.id, {
        isOnline: newStatus,
      });

      if (!response.success) {
        // Revert on failure
        setUser({ ...currentUser, isOnline: oldStatus } as any);
        toast.error(response.message);
        return;
      }
      toast.success(`Status updated to ${newStatus ? "Online" : "Offline"}`);
    } catch (err: any) {
      setUser({ ...currentUser, isOnline: oldStatus } as any);
      toast.error(err.message || "Status update failed");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Loading State from Old File
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

  const safeUser = currentUser as unknown as User;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-6">
            <div className="relative shrink-0 group/avatar">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 cursor-pointer relative"
              >
                {safeUser.profileImageUrl ? (
                  <img
                    src={safeUser.profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover group-hover/avatar:opacity-75 transition-opacity"
                  />
                ) : (
                  <UserIcon className="p-5 text-gray-400 group-hover/avatar:opacity-75" />
                )}
                {/* Overlay Icon for Upload */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <Camera size={24} className="text-[#1B4332]" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-gray-100">
                <CheckCircle2
                  size={20}
                  className="text-[#1B4332] fill-green-50"
                />
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {safeUser.name}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm font-medium text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Briefcase size={16} /> {safeUser.role}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <StatusBadge status={safeUser.isVerified} />
              </div>
            </div>
          </div>

          {safeUser.role === "worker" && (
            <button
              onClick={handleToggleOnline}
              disabled={isUpdatingStatus}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm
                ${safeUser.isOnline
                  ? "bg-[#1B4332] text-white hover:bg-[#143326] shadow-emerald-900/10"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                }
                ${isUpdatingStatus ? "opacity-70 cursor-wait" : ""}
              `}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${safeUser.isOnline ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
              />
              {safeUser.isOnline ? "You are Online" : "You are Offline"}
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-10">
          <nav className="flex space-x-10" aria-label="Tabs">
            {[
              { id: "profile", label: "Profile", icon: UserIcon },
              { id: "addresses", label: "Addresses", icon: MapPin },
              { id: "slot", label: "Slot", icon: Calendar1 },
              { id: "wallet", label: "Wallet", icon: WalletIcon },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`
                                group inline-flex items-center py-5 px-1 border-b-2 font-medium text-base transition-all
                                ${isActive
                      ? "border-[#1B4332] text-[#1B4332]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                            `}
                >
                  <Icon
                    size={18}
                    className={`mr-2.5 ${isActive
                      ? "text-[#1B4332]"
                      : "text-gray-400 group-hover:text-gray-500"
                      }`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="min-h-[600px]">
          {activeTab === "profile" && (
            <ProfileView
              user={safeUser}
              setUser={(updatedUser) => setUser(updatedUser as any)}
            />
          )}
          {activeTab === "addresses" && (
            <AddressesView
              user={safeUser}
              setUser={(updatedUser) => setUser(updatedUser as any)}
            />
          )}
          {activeTab === "slot" && (
            <SlotView
              user={safeUser}
              setUser={(updatedUser) => setUser(updatedUser as any)}
            />
          )}
          {activeTab === "wallet" && (
            <WalletView
              user={safeUser}
              setUser={(updatedUser) => setUser(updatedUser as any)}
            />
          )}
          {activeTab === "settings" && (
            <SettingsView user={safeUser} setUser={(u) => setUser(u as any)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
