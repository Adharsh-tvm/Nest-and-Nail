import React, { useState, useEffect } from "react";
import { X, Wrench, Loader2, Send, ImagePlus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface ServiceRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "PLUMBING",
        description: "",
        images: [] as File[], // Storing File objects for now, will handle upload in submit
    });

    // Reset form on open
    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: "",
                category: "PLUMBING",
                description: "",
                images: [],
            });
        }
    }, [isOpen]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...newFiles],
            }));
        }
    };

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            // Here we would typically upload images first, then submit the data
            // For now, we pass the form data as is
            await onSubmit(formData);
            toast.success("Service request added successfully");
            onClose();
        } catch (error) {
            console.error("Failed to submit request:", error);
            toast.error("Failed to submit request");
        } finally {
            setIsSubmitting(false);
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
                        <Wrench size={20} className="text-[#1B4332]" />
                        New Service Request
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
                    {/* Title */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Leaking Faucet"
                            className="w-full text-base p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#1B4332] outline-none"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full text-base p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#1B4332] outline-none bg-white"
                        >
                            <option value="PLUMBING">Plumbing</option>
                            <option value="ELECTRICAL">Electrical</option>
                            <option value="CLEANING">Cleaning</option>
                            <option value="CARPENTRY">Carpentry</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Describe the issue in detail..."
                            className="w-full text-base p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#1B4332] outline-none resize-none"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                            Images
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.images.map((file, index) => (
                                <div key={index} className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#1B4332]/50 hover:bg-[#1B4332]/5 transition-colors">
                                <ImagePlus size={24} className="text-gray-400" />
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">Upload photos to help describe the issue.</p>
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
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-[#1B4332] text-white rounded-lg text-sm font-bold hover:bg-[#143326] transition-colors flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Send size={16} />
                        )}
                        Add Request
                    </button>
                </div>
            </div>
        </div>
    );
};
