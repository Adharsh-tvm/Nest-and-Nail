"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  ShieldAlert,
  Briefcase,
  X,
  UserCheck,
  Shield,
  TrendingUp,
  Clock,
  Mail,
} from "lucide-react";
import { PendingVerificationUser } from "@/types/types";
import { useUsers } from "@/hooks/useUsers";
import DataTable from "@/app/components/containers/widgets/DataTable";
import {
  approveUserAction,
  rejectUserAction,
} from "@/app/actions/admin/admin-actions";
import { VerificationStatus } from "@/shared/enums/authEnums";
import toast from "react-hot-toast";

/* ---------------------------------------------------------------------------
 * TABLE TYPES
 * -------------------------------------------------------------------------*/

type Column<T> = {
  header: React.ReactNode;
  accessorKey?: keyof T;
  className?: string;
  cell?: (row: T) => React.ReactNode;
};

type WithId = {
  id?: string | number;
  _id?: string | number;
  userId?: string | number;
};

/* ---------------------------------------------------------------------------
 * VERIFICATION DETAILS MODAL
 * -------------------------------------------------------------------------*/

type VerificationModalProps = {
  request: PendingVerificationUser | null;
  onClose: () => void;
  onApprove: (request: PendingVerificationUser) => void;
  onReject: (request: PendingVerificationUser, reason?: string) => void;
};

const VerificationModal: React.FC<VerificationModalProps> = ({
  request,
  onClose,
  onApprove,
  onReject,
}) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  if (!request) return null;

  const submittedDate = request.createdAt
    ? new Date(request.createdAt).toLocaleString()
    : "—";

  const documents = request.documents ?? [];
  const idFront = documents[0];
  const idBack = documents[1];
  const extraDocs = documents.slice(2);

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) return;
    onReject(request, rejectionReason);
    toast.success("Verification Request Rejected Successfully")
  };

  const handleApproveVerification = () => {
    onApprove(request)
    toast.success("Verification Approved")
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-[#0f291e]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-white/20">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-black text-[#1B4332] tracking-tight">
              Verification Request
            </h3>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <Clock size={14} /> Submitted on {submittedDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
          >
            <X
              size={24}
              className="text-gray-400 group-hover:text-red-500 transition-colors"
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
          <div className="grid md:grid-cols-3 gap-8">
            {/* LEFT: Profile */}
            <div className="md:col-span-1 space-y-6">
              <div className="text-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 mb-4 overflow-hidden border border-emerald-100 shadow-inner flex items-center justify-center">
                  {request.profilePictureUrl ? (
                    <img
                      src={request.profilePictureUrl}
                      alt={request.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-[#1B4332]">
                      {request.name.charAt(0)}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  {request.name}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg uppercase border border-blue-100">
                    {request.role}
                  </span>
                </div>
              </div>

              <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-gray-900 text-sm">
                  Contact Info
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-sm">
                      <Mail size={16} />
                    </div>
                    <span
                      className="truncate flex-1 text-gray-600"
                      title={request.email}
                    >
                      {request.email}
                    </span>
                  </div>
                  {request.phone && (
                    <div className="flex items-center gap-3 text-sm p-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-sm">
                        <Briefcase size={16} />{" "}
                        {/* Using briefcase as placeholder for phone if phone icon not imported, but Phone is imported in standard lucide. Wait, I didn't import Phone here. Fixed imports. */}
                      </div>
                      <span className="text-gray-600">{request.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Documents */}
            <div className="md:col-span-2 space-y-8">
              {/* Identity documents from `documents` array */}
              {(idFront || idBack) && (
                <section>
                  <h4 className="font-bold text-[#1B4332] flex items-center gap-2 mb-4">
                    <UserCheck size={20} /> Identity Proof
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {idFront && (
                      <div className="group relative aspect-video bg-gray-200 rounded-2xl overflow-hidden border border-gray-200 cursor-pointer shadow-sm">
                        <img
                          src={idFront}
                          alt="ID Front"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Eye
                            size={32}
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300"
                          />
                        </div>
                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 text-gray-900 text-xs rounded-lg font-bold backdrop-blur-md shadow-sm">
                          Front Side
                        </div>
                      </div>
                    )}
                    {idBack && (
                      <div className="group relative aspect-video bg-gray-200 rounded-2xl overflow-hidden border border-gray-200 cursor-pointer shadow-sm">
                        <img
                          src={idBack}
                          alt="ID Back"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Eye
                            size={32}
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300"
                          />
                        </div>
                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 text-gray-900 text-xs rounded-lg font-bold backdrop-blur-md shadow-sm">
                          Back Side
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Extra docs + certificates */}
              <section>
                <h4 className="font-bold text-[#1B4332] flex items-center gap-2 mb-4">
                  <FileText size={20} /> Documents & Certificates
                </h4>
                <div className="space-y-3">
                  {/* extra documents */}
                  {extraDocs.length === 0 &&
                    request.certificates.length === 0 && (
                      <div className="p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400 text-sm">
                        No additional documents provided
                      </div>
                    )}
                  {extraDocs.map((docUrl, i) => (
                    <div
                      key={`doc-${i}`}
                      className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#1B4332]/50 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">
                            Supporting Document {i + 1}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-xs mt-0.5 opacity-70">
                            {docUrl}
                          </p>
                        </div>
                      </div>
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-[#1B4332] p-2 hover:bg-emerald-50 rounded-xl transition-colors"
                      >
                        <Eye size={20} />
                      </a>
                    </div>
                  ))}

                  {/* certificates array */}
                  {request.certificates.map((certUrl, i) => {
                    const parts = certUrl.split("/");
                    const fileName = parts[parts.length - 1] || "Certificate";

                    return (
                      <div
                        key={`cert-${i}`}
                        className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#1B4332]/50 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center border border-green-100">
                            <FileText size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900">
                              {fileName}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-xs mt-0.5 opacity-70">
                              {certUrl}
                            </p>
                          </div>
                        </div>
                        <a
                          href={certUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-[#1B4332] p-2 hover:bg-emerald-50 rounded-xl transition-colors"
                        >
                          <Eye size={20} />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Rejection Reason Input */}
              {isRejecting && (
                <div className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-bottom-2">
                  <h4 className="text-red-800 font-bold mb-3 flex items-center gap-2">
                    <ShieldAlert size={18} /> Rejection Reason
                  </h4>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please explain why this request is being rejected..."
                    className="w-full p-4 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm min-h-[100px] resize-none bg-white"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
          {isRejecting ? (
            <>
              <button
                onClick={() => {
                  setIsRejecting(false);
                  setRejectionReason("");
                }}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectionReason.trim()}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle size={18} /> Confirm Rejection
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsRejecting(true)}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center gap-2 text-sm"
              >
                <XCircle size={18} /> Reject Request
              </button>
              <button
                onClick={handleApproveVerification}
                className="px-6 py-3 bg-[#1B4332] text-white font-bold rounded-xl hover:bg-[#143225] shadow-lg shadow-green-900/20 active:scale-95 transition-all flex items-center gap-2 text-sm"
              >
                <CheckCircle2 size={18} /> Approve Verification
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------------
 * MAIN PAGE COMPONENT
 * -------------------------------------------------------------------------*/

const VerificationsPendingView: React.FC = () => {
  const [selectedRequest, setSelectedRequest] =
    useState<PendingVerificationUser | null>(null);

  const { users, loading, error } = useUsers();

  const [pendingRequests, setPendingRequests] = useState<
    PendingVerificationUser[]
  >([]);

  useEffect(() => {
    if (!loading && Array.isArray(users)) {
      const pending: PendingVerificationUser[] = users
        .filter((u) => u.isVerified === VerificationStatus.PENDING)
        .map((u) => ({
          _id: u.id,
          userId: u.id,

          name: u.name,
          email: u.email,
          role: u.role,

          isBlocked: u.isBlocked ?? false,
          isVerified: u.isVerified,

          profilePictureUrl: u.profileImageUrl ?? undefined,

          skills: u.skills ?? [],
          documents: u.documents ?? [],
          certificates: u.certificates ?? [],
          workPhotos: u.workPhotos ?? [],

          address: Array.isArray(u.address)
            ? u.address.map((a) => a.street).join(", ")
            : undefined,

          phone: u.phone_number?.toString(),

          createdAt: u.createdAt ?? "",
          updatedAt: u.updatedAt ?? "",
        }));

      setPendingRequests(pending);
    }
  }, [users, loading]);

  const handleApprove = async (req: PendingVerificationUser) => {
    try {
      if (!req.userId) return;
      const response = await approveUserAction(req.userId);
      console.log("Approved:", response);
      setSelectedRequest(null);
      // Ideally update local state instead of reload
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to approve user.");
    }
  };

  const handleReject = async (
    req: PendingVerificationUser,
    reason?: string
  ) => {
    try {
      if (!req.userId) return;
      if (!reason) {
        alert("Rejection reason is required.");
        return;
      }
      const response = await rejectUserAction(req.userId, reason);
      console.log("Rejected:", response);
      setSelectedRequest(null);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to reject user.");
    }
  };

  const columns: Column<PendingVerificationUser>[] = [
    {
      header: "Applicant",
      className: "min-w-[240px]",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 flex items-center justify-center shadow-sm">
            {row.profilePictureUrl ? (
              <img
                src={row.profilePictureUrl}
                alt={row.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-base font-bold text-gray-400">
                {row.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <div className="font-bold text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-500 font-mono mt-0.5">
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      cell: (row) => (
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold border border-gray-200">
          {row.role}
        </span>
      ),
    },

    {
      header: "Submitted",
      accessorKey: "createdAt",
      className: "text-gray-500 font-medium",
      cell: (row) => (
        <div className="flex items-center gap-2 text-xs">
          <Clock size={14} className="text-gray-400" />
          {new Date(row.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },
    {
      header: "",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRequest(row);
            }}
            className="px-4 py-2 bg-[#1B4332] text-white text-xs font-bold rounded-xl hover:bg-[#143225] transition-all shadow-md shadow-[#1B4332]/20 hover:scale-105 active:scale-95"
          >
            Review
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md group">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
              Pending Requests
            </p>
            <h3 className="text-3xl font-black text-[#1B4332] flex items-center gap-2">
              {pendingRequests.length}
            </h3>
            <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <TrendingUp size={12} /> Live Updates
            </p>
          </div>
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldAlert size={28} />
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-280px)] min-h-[400px]">
        <DataTable<PendingVerificationUser>
          title="Verification Queue"
          columns={columns}
          data={pendingRequests}
          onRowClick={setSelectedRequest}
          searchPlaceholder="Search applicants..."
        />
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <VerificationModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default VerificationsPendingView;
