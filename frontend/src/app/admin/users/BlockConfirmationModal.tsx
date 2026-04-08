import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X, Ban, Unlock } from "lucide-react";

interface BlockConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
    isBlocked: boolean; // Current status
}

const BlockConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    userName,
    isBlocked,
}: BlockConfirmationModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            setMounted(false);
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    const isBlocking = !isBlocked; // If currently not blocked, action is to block

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-300 flex flex-col">
                <div className="p-6 text-center">
                    <div
                        className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${isBlocking ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                            }`}
                    >
                        {isBlocking ? <Ban size={32} /> : <Unlock size={32} />}
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-2">
                        {isBlocking ? "Block User?" : "Unblock User?"}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        Are you sure you want to <strong>{isBlocking ? "block" : "unblock"}</strong>{" "}
                        <span className="text-gray-900 font-bold">{userName}</span>?
                        <br />
                        {isBlocking
                            ? "This user will lose access to their account immediately."
                            : "This user will regain access to their account immediately."}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 py-3 px-4 font-bold rounded-xl text-white shadow-lg transform active:scale-95 transition-all ${isBlocking
                                    ? "bg-red-500 hover:bg-red-600 shadow-red-200"
                                    : "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
                                }`}
                        >
                            {isBlocking ? "Yes, Block User" : "Yes, Unblock User"}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default BlockConfirmationModal;
