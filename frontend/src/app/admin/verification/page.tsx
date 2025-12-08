"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  ShieldAlert,
  Briefcase,
  X,
  UserCheck,
} from "lucide-react";
import { PendingVerificationUser } from "@/types/types";
import { useUsers } from "@/hooks/useUsers";
import DataTable from "@/app/components/containers/DataTable";
import { approveUserVerification, rejectUserVerification } from "@/services/api/admin.api";

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

type DataTableProps<T extends WithId> = {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  title?: string;
  actions?: React.ReactNode;
  searchPlaceholder?: string;
  isLoading?: boolean;
};

/* ---------------------------------------------------------------------------
 * VERIFICATION DETAILS MODAL
 * -------------------------------------------------------------------------*/

type VerificationModalProps = {
  request: PendingVerificationUser | null;
  onClose: () => void;
  onApprove: (request: PendingVerificationUser) => void;
  onReject: (request: PendingVerificationUser) => void;
};

const VerificationModal: React.FC<VerificationModalProps> = ({
  request,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!request) return null;

  const submittedDate = new Date(request.createdAt).toLocaleString();

  const idFront = request.documents[0];
  const idBack = request.documents[1];
  const extraDocs = request.documents.slice(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-[#0f291e]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-[#1B4332]">
              Verification Request
            </h3>
            <p className="text-xs text-gray-500">
              Submitted on {submittedDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* LEFT: Profile */}
            <div className="md:col-span-1 space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-sm flex items-center justify-center">
                  {request.profilePictureUrl ? (
                    <img
                      src={request.profilePictureUrl}
                      alt={request.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gray-500">
                      {request.name.charAt(0)}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {request.name}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase">
                    {request.role}
                  </span>
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="truncate" title={request.email}>
                    {request.email}
                  </span>
                </div>
                {request.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-gray-400" />
                    <span>{request.phone}</span>
                  </div>
                )}
                {request.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase size={16} className="text-gray-400" />
                    <span className="truncate">{request.address}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm text-gray-900 mb-3">
                  Skills & Trades
                </h4>
                <div className="flex flex-wrap gap-2">
                  {request.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-lg font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Documents */}
            <div className="md:col-span-2 space-y-8">
              {/* Identity documents from `documents` array */}
              {(idFront || idBack) && (
                <section>
                  <h4 className="font-bold text-[#1B4332] flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                    <UserCheck size={18} /> Identity Proof
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {idFront && (
                      <div className="group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 cursor-pointer">
                        <img
                          src={idFront}
                          alt="ID Front"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="bg-white/90 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold shadow-sm">
                            View Full Size
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] rounded font-medium backdrop-blur-sm">
                          Front Side
                        </div>
                      </div>
                    )}
                    {idBack && (
                      <div className="group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 cursor-pointer">
                        <img
                          src={idBack}
                          alt="ID Back"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="bg-white/90 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold shadow-sm">
                            View Full Size
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] rounded font-medium backdrop-blur-sm">
                          Back Side
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Extra docs + certificates */}
              <section>
                <h4 className="font-bold text-[#1B4332] flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <FileText size={18} /> Documents & Certificates
                </h4>
                <div className="space-y-3">
                  {/* extra documents */}
                  {extraDocs.map((docUrl, i) => (
                    <div
                      key={`doc-${i}`}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-[#1B4332] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            Document {i + 3}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">
                            {docUrl}
                          </p>
                        </div>
                      </div>
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-[#1B4332] p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
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
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-[#1B4332] transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900">
                              {fileName}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">
                              {certUrl}
                            </p>
                          </div>
                        </div>
                        <a
                          href={certUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-[#1B4332] p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye size={18} />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => onReject(request)}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center gap-2"
          >
            <XCircle size={18} /> Reject
          </button>
          <button
            onClick={() => onApprove(request)}
            className="px-6 py-2.5 bg-[#1B4332] text-white font-bold rounded-xl hover:bg-[#143225] shadow-lg shadow-green-900/20 transition-all flex items-center gap-2"
          >
            <CheckCircle2 size={18} /> Approve Verification
          </button>
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
    if (!loading && users && Array.isArray(users)) {
      const pending = users
        .filter((u) => u.isVerified === "PENDING")
        .map((u) => ({
          _id: u.user_id,
          userId: u.user_id,
          name: u.user_name,
          email: u.email_address,
          role: u.user_role,
          isBlocked: u.isBlocked,
          isVerified: u.isVerified,
          profilePictureUrl: u.profileImageUrl,
          skills: u.skills ?? [],
          address: u.address ?? "",
          phone: u.phone_number?.toString(),
          documents: u.documents ?? [],
          certificates: u.certificates ?? [],
          workPhotos: u.workPhotos ?? [],
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        }));

      setPendingRequests(pending);
    }
  }, [users, loading]);

  console.log("pendingRequests", pendingRequests);

  const handleApprove = async (req: PendingVerificationUser) => {
    try {
      const response = await approveUserVerification(req.userId);
      console.log("Approved:", response);


      setSelectedRequest(null);

      // optional: refresh list
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to approve user.");
    }
  };

  const handleReject = async (req: PendingVerificationUser) => {
    try {

      const response = await rejectUserVerification(req.userId);
      console.log("Rejected:", response);


      setSelectedRequest(null);

      // optional refresh
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to reject user.");
    }
  };

  const columns: Column<PendingVerificationUser>[] = [
    {
      header: "Applicant",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
            {row.profilePictureUrl ? (
              <img
                src={row.profilePictureUrl}
                alt={row.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-gray-500">
                {row.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <div className="font-bold text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-400">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      cell: (row) => (
        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold border border-gray-200">
          {row.role}
        </span>
      ),
    },
    {
      header: "Skills",
      cell: (row) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {row.skills.slice(0, 2).map((skill, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium border border-blue-100"
            >
              {skill}
            </span>
          ))}
          {row.skills.length > 2 && (
            <span className="text-[10px] text-gray-400 pl-1">
              +{row.skills.length - 2} more
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Submitted",
      accessorKey: "createdAt",
      className: "text-gray-500 font-medium",
      cell: (row) =>
        new Date(row.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      header: "Action",
      className: "text-right",
      cell: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRequest(row);
          }}
          className="px-4 py-2 bg-[#1B4332] text-white text-xs font-bold rounded-lg hover:bg-[#143225] transition-colors shadow-sm"
        >
          Review Request
        </button>
      ),
    },
  ];

  return (
    <div className="w-full h-full space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
              Pending Requests
            </p>
            <h3 className="text-2xl font-extrabold text-[#1B4332] mt-1">
              {pendingRequests.length}
            </h3>
          </div>
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
            <ShieldAlert size={20} />
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-200px)] min-h-[400px]">
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
