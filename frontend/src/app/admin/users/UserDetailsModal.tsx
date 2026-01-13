import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    X,
    Mail,
    Phone,
    Calendar,
    Shield,
    BadgeCheck,
    Ban,
    User,
    MapPin,
    Clock,
    CheckCircle,
    FileText,
    Award,
    Briefcase,
    Image as ImageIcon,
    LayoutGrid,
    Download,
    Home,
    Building2
} from "lucide-react";
import { VerificationStatus } from "@/shared/enums/authEnums";
import { User as UserType } from "@/shared/types/userTypes";

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserType | null;
}

type TabType = 'overview' | 'professional' | 'documents' | 'gallery';

const UserDetailsModal = ({ isOpen, onClose, user }: UserDetailsModalProps) => {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            setMounted(false);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Reset tab when user changes or modal closes
    useEffect(() => {
        if (!isOpen) setActiveTab('overview');
    }, [isOpen, user]);

    if (!mounted || !isOpen || !user) return null;

    const TabButton = ({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === id
                ? 'border-[#1B4332] text-[#1B4332]'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
        >
            <Icon size={18} />
            {label}
        </button>
    );

    // Helper to determine if an item is an object or string and extract name/url safely
    const safeRender = (item: any, type: 'doc' | 'cert' | 'photo') => {
        const isString = typeof item === 'string';

        if (type === 'doc') {
            return {
                name: isString ? 'Document' : item.name || item.type || 'Document',
                type: isString ? 'FILE' : item.type || 'FILE',
                url: isString ? item : item.url,
                raw: item
            }
        }
        if (type === 'cert') {
            return {
                name: isString ? item : item.name || 'Certificate',
                org: isString ? 'Unknown Organization' : item.organization || item.issuer || '',
                date: isString ? null : item.date,
                url: isString ? null : item.url
            }
        }
        if (type === 'photo') {
            return {
                url: isString ? item : item.url
            }
        }
        return { name: 'Unknown', url: '' };
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#1B4332]/5 flex items-center justify-center text-[#1B4332]">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-gray-900 leading-tight">{user.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                    ID: {user.id}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 border-b border-gray-100 flex flex-wrap gap-2 bg-white shrink-0">
                    <TabButton id="overview" label="Overview" icon={LayoutGrid} />
                    <TabButton id="professional" label="Professional" icon={Briefcase} />
                    <TabButton id="documents" label="Documents" icon={FileText} />
                    <TabButton id="gallery" label="Gallery" icon={ImageIcon} />
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto bg-gray-50/50 grow">
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                            {/* Main User Card */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-32 h-32 shrink-0 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden relative">
                                    {user.profileImageUrl ? (
                                        <img src={user.profileImageUrl} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-bold text-gray-300">{user.name?.charAt(0)}</span>
                                    )}
                                    {user.isVerified === VerificationStatus.VERIFIED && (
                                        <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full shadow-md border-2 border-white">
                                            <BadgeCheck size={16} fill="currentColor" className="text-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Contact Info</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="p-2 bg-white rounded-lg text-[#1B4332] shadow-sm"><Mail size={16} /></div>
                                                <div className="overflow-hidden">
                                                    <p className="text-xs text-gray-400 font-medium">Email Address</p>
                                                    <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                            {user.phone_number && (
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                    <div className="p-2 bg-white rounded-lg text-[#1B4332] shadow-sm"><Phone size={16} /></div>
                                                    <div>
                                                        <p className="text-xs text-gray-400 font-medium">Phone Number</p>
                                                        <p className="text-sm font-bold text-gray-900">{user.phone_number}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Account Status</h4>
                                        <div className="space-y-3">
                                            <div className={`p-3 rounded-xl border flex items-center gap-3 ${user.isBlocked ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                                                {user.isBlocked ? <Ban size={20} /> : <CheckCircle size={20} />}
                                                <div>
                                                    <p className="text-xs font-bold uppercase opacity-70">Access</p>
                                                    <p className="font-bold">{user.isBlocked ? "Blocked" : "Active"}</p>
                                                </div>
                                            </div>
                                            <div className={`p-3 rounded-xl border flex items-center gap-3 
                                    ${user.isVerified === VerificationStatus.VERIFIED ? 'bg-blue-50 border-blue-100 text-blue-700' :
                                                    user.isVerified === VerificationStatus.PENDING ? 'bg-amber-50 border-amber-100 text-amber-700' :
                                                        'bg-gray-50 border-gray-100 text-gray-700'}`}>
                                                {user.isVerified === VerificationStatus.VERIFIED ? <BadgeCheck size={20} /> : <Shield size={20} />}
                                                <div>
                                                    <p className="text-xs font-bold uppercase opacity-70">Verification</p>
                                                    <p className="font-bold">{user.isVerified}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Location */}
                                {user.address && user.address.length > 0 && (
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                            <MapPin size={18} className="text-[#1B4332]" /> Locations
                                        </h4>
                                        <div className="space-y-3">
                                            {user.address.map((addr: any, idx: number) => (
                                                <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#1B4332]/20 transition-colors">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            {addr.label?.toLowerCase() === 'home' ? <Home size={14} className="text-[#1B4332]" /> : <Building2 size={14} className="text-gray-400" />}
                                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{addr.label || "Address"}</span>
                                                        </div>
                                                        {addr.isDefault && (
                                                            <span className="text-[10px] font-bold bg-[#1B4332] text-white px-2 py-0.5 rounded-full">DEFAULT</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                                        {addr.street}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-sm text-gray-600">{addr.city}</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                        <span className="text-xs text-gray-500 font-mono bg-white border px-1.5 rounded">{addr.zip}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Timestamps */}
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        <Calendar size={18} className="text-[#1B4332]" /> Timeline
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <Clock size={16} className="text-gray-400" />
                                                <span className="text-sm text-gray-600 font-medium">Joined</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <Clock size={16} className="text-gray-400" />
                                                <span className="text-sm text-gray-600 font-medium">Last Updated</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">
                                                {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'professional' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                            {/* Skills */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Award size={20} className="text-[#1B4332]" /> Skills & Expertise
                                </h4>
                                {user.skills && user.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user.skills.map((skill: any, idx: number) => (
                                            <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-100">
                                                {typeof skill === 'string' ? skill : skill.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <Award size={32} className="mx-auto text-gray-300 mb-2" />
                                        <p className="text-gray-400 text-sm font-medium">No skills listed</p>
                                    </div>
                                )}
                            </div>

                            {/* Certificates */}
                            {/* <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <BadgeCheck size={20} className="text-[#1B4332]" /> Certifications
                                </h4>
                                {user.certificates && user.certificates.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {user.certificates.map((cert: any, idx: number) => {
                                            const data = safeRender(cert, 'cert');
                                            return (
                                                <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-amber-500 shrink-0">
                                                        <Award size={20} />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-gray-900">{data.name}</h5>
                                                        {data.org && <p className="text-sm text-gray-500 mt-1">{data.org}</p>}
                                                        {data.date && <p className="text-xs text-gray-400 mt-1">{new Date(data.date).toLocaleDateString()}</p>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <BadgeCheck size={32} className="mx-auto text-gray-300 mb-2" />
                                        <p className="text-gray-400 text-sm font-medium">No certificates available</p>
                                    </div>
                                )}
                            </div> */}
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FileText size={20} className="text-[#1B4332]" /> Uploaded Documents
                                </h4>
                                {user.documents && user.documents.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {user.documents.map((doc: any, idx: number) => {
                                            const data = safeRender(doc, 'doc');
                                            return (
                                                <div key={idx} className="group relative p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all flex items-start gap-3">
                                                    <div className="p-3 bg-white rounded-xl shadow-sm text-red-500">
                                                        <FileText size={24} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-gray-900 truncate pr-6">{data.name}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">
                                                            {data.type}
                                                        </p>
                                                    </div>
                                                    {data.url && (
                                                        <a
                                                            href={data.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm text-gray-400 hover:text-[#1B4332] transition-colors"
                                                            title="View Document"
                                                        >
                                                            <Download size={16} />
                                                        </a>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <FileText size={48} className="mx-auto text-gray-200 mb-3" />
                                        <p className="text-gray-400 font-medium">No documents uploaded</p>
                                        <p className="text-xs text-gray-300 mt-1">User hasn't submitted verification documents yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'gallery' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <ImageIcon size={20} className="text-[#1B4332]" /> Work Portfolio
                                </h4>
                                {user.workPhotos && user.workPhotos.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {user.workPhotos.map((photo: any, idx: number) => {
                                            const data = safeRender(photo, 'photo');
                                            return (
                                                <div key={idx} className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer border border-gray-100 bg-gray-50">
                                                    <img
                                                        src={data.url}
                                                        alt={`Work ${idx + 1}`}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full border border-white/20">
                                                            View
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <ImageIcon size={48} className="mx-auto text-gray-200 mb-3" />
                                        <p className="text-gray-400 font-medium">No work photos added</p>
                                        <p className="text-xs text-gray-300 mt-1">User hasn't uploaded any portfolio images.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-white border-t border-gray-100 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 bg-[#1B4332] text-white font-bold rounded-xl hover:bg-[#153426] transition-all shadow-md active:scale-95"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default UserDetailsModal;
