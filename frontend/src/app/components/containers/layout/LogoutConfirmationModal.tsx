import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";

interface LogoutConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LogoutConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
}: LogoutConfirmationModalProps) => {
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

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-300 flex flex-col">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-red-50 text-red-600">
                        <LogOut size={32} />
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-2">
                        Confirm Logout
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        Are you sure you want to log out? <br />
                        You will need to sign in again to access the admin dashboard.
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
                            className="flex-1 py-3 px-4 font-bold rounded-xl text-white shadow-lg transform active:scale-95 transition-all bg-red-500 hover:bg-red-600 shadow-red-200"
                        >
                            Yes, Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LogoutConfirmationModal;
