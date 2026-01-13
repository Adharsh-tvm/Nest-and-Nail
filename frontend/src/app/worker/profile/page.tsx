"use client";

import React, { useState } from "react";
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
  AlertCircle,
  Clock,
  Eye,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { VerificationStatus } from "@/shared/enums/authEnums";

// --- Helper Functions ---

const getVerificationBadge = (status: VerificationStatus | string) => {
  switch (status) {
    case "VERIFIED":
      return {
        color: "bg-[#1B4332] text-white",
        icon: <ShieldCheck size={14} />,
        label: "Verified",
      };
    case "PENDING":
      return {
        color: "bg-yellow-100 text-yellow-700",
        icon: <Clock size={14} />,
        label: "Pending Verification",
      };
    case "REJECTED":
      return {
        color: "bg-red-100 text-red-700",
        icon: <AlertCircle size={14} />,
        label: "Verification Failed",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-600",
        icon: <ShieldCheck size={14} />,
        label: "Unverified",
      };
  }
};

const isImageFile = (url: string | undefined | null): boolean => {
  if (!url) return false;
  return (
    url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null ||
    url.includes("images.unsplash.com")
  );
};

// --- Sub-components ---

interface DocumentCardProps {
  url: string;
  label: string;
  type?: "document" | "certificate";
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  url,
  label,
  type = "document",
}) => {
  const isImage = isImageFile(url);
  const fileName = url.split("/").pop() || "Document";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md hover:border-[#1B4332] transition-all h-32"
    >
      {isImage ? (
        <>
          <img src={url} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <Eye
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
              size={24}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 truncate px-2">
            {fileName}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 group-hover:bg-gray-100 transition-colors p-2">
          <FileText
            className={`mb-2 ${
              type === "certificate" ? "text-red-500" : "text-gray-400"
            }`}
            size={32}
          />
          <span className="text-xs font-medium text-gray-600 truncate w-full text-center px-2">
            {fileName}
          </span>
          <span className="text-[10px] text-gray-400 uppercase font-bold mt-1">
            PDF / DOC
          </span>
        </div>
      )}

      {/* Type Badge */}
      <div
        className={`absolute top-2 right-2 p-1 rounded-md text-[10px] font-bold uppercase ${
          type === "certificate"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {type === "certificate" ? "Lic" : "Doc"}
      </div>
    </a>
  );
};

// --- Main Component ---

const WorkerProfile = () => {
  const { user: currentUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  // Fallback if user is null
  if (!currentUser)
    return (
      <div className="p-8 text-center text-gray-500">Loading profile...</div>
    );

  const verificationStyle = getVerificationBadge(currentUser.isVerified);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* --- Header Section --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="h-32 bg-[#1B4332] relative">
            <div className="absolute top-4 right-4 flex gap-3">
              {/* Availability Toggle */}
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`px-4 py-2 rounded-full font-bold text-xs transition-colors border flex items-center gap-2 ${
                  isAvailable
                    ? "bg-green-500 text-white border-green-600"
                    : "bg-gray-800/50 text-gray-300 border-gray-700 backdrop-blur-md"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isAvailable ? "bg-white animate-pulse" : "bg-gray-400"
                  }`}
                ></div>
                {isAvailable ? "Available for Work" : "Offline"}
              </button>
            </div>
          </div>

          <div className="px-8 pb-6 relative">
            <div className="flex flex-col sm:flex-row items-end -mt-12 mb-4 gap-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-md bg-gray-100 flex items-center justify-center overflow-hidden">
                  {currentUser.profileImageUrl ? (
                    <img
                      src={currentUser.profileImageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={48} className="text-gray-300" />
                  )}
                </div>
              </div>

              {/* Name & Role */}
              <div className="flex-1 pb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentUser.name}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${verificationStyle.color}`}
                  >
                    {verificationStyle.icon}
                    {verificationStyle.label}
                  </span>
                  <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200 uppercase">
                    {currentUser.role}
                  </span>
                </div>
              </div>

              {/* Edit Action */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mb-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm flex items-center gap-2"
              >
                <Edit2 size={14} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* --- Left Column: Contact & Info --- */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-[#1B4332] mb-4 text-sm uppercase tracking-wide">
                Contact Details
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-gray-400 mt-1" />
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">
                      Email
                    </label>
                    <p className="text-sm font-medium text-gray-900 break-all">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gray-400 mt-1" />
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">
                      Phone
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser.phone_number || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-gray-400 mt-1" />
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">
                      Address
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser.address && currentUser.address.length > 0 ? (
                        <div className="space-y-1">
                          {currentUser.address.map((addr) => (
                            <p
                              key={addr.id}
                              className="text-sm font-medium text-gray-900 leading-relaxed"
                            >
                              {addr.street}, {addr.city} {addr.zip}
                              {addr.isDefault && (
                                <span className="ml-2 text-xs font-bold text-green-600">
                                  (Default)
                                </span>
                              )}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-gray-400">—</p>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
                  <Calendar size={16} className="text-gray-400 mt-1" />
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">
                      Joined
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser.createdAt
                        ? new Date(currentUser.createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-[#1B4332] mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                <Briefcase size={16} /> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.skills && currentUser.skills.length > 0 ? (
                  currentUser.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400 italic">
                    No skills added yet.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* --- Right Column: Portfolio & Docs --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Work Photos (Portfolio) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-[#1B4332] mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                <ImageIcon size={16} /> Work Portfolio
              </h3>
              {currentUser.workPhotos && currentUser.workPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {currentUser.workPhotos.map((photo, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group cursor-pointer"
                    >
                      <img
                        src={photo}
                        alt={`Work ${i}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">
                    No work photos uploaded.
                  </p>
                </div>
              )}
            </div>

            {/* Certificates & Documents (New Grid Layout) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-[#1B4332] mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                <FileText size={16} /> Documents & Certificates
              </h3>

              {/* Separate sections for clarity but same visual grid style */}
              <div className="space-y-6">
                {/* Certificates Grid */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 mb-2">
                    Licenses & Certifications
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {currentUser.certificates &&
                    currentUser.certificates.length > 0 ? (
                      currentUser.certificates.map((cert, i) => (
                        <DocumentCard
                          key={`cert-${i}`}
                          url={cert}
                          label={`Certificate ${i}`}
                          type="certificate"
                        />
                      ))
                    ) : (
                      <p className="col-span-full text-sm text-gray-400 italic">
                        No certificates available.
                      </p>
                    )}
                  </div>
                </div>

                {/* Docs Grid */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 mb-2">
                    General Documents
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {currentUser.documents &&
                    currentUser.documents.length > 0 ? (
                      currentUser.documents.map((doc, i) => (
                        <DocumentCard
                          key={`doc-${i}`}
                          url={doc}
                          label={`Document ${i}`}
                          type="document"
                        />
                      ))
                    ) : (
                      <p className="col-span-full text-sm text-gray-400 italic">
                        No general documents available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
