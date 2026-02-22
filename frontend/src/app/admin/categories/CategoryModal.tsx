import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Loader2,
  Link as LinkIcon,
  Type,
  Activity,
} from "lucide-react";
import { Category, CategoryInput } from "@/shared/types/categoryTypes";
import toast from "react-hot-toast";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryInput) => Promise<void>;
  category?: Category | null;
  isLoading?: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CategoryInput>({
    name: "",
    slug: "",
    isActive: true,
  });

  const [touched, setTouched] = useState({
    name: false,
    slug: false,
  });

  // Reset/Populate form
  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name,
          slug: category.slug,
          isActive: category.isActive,
        });
      } else {
        setFormData({
          name: "",
          slug: "",
          isActive: true,
        });
      }
      setTouched({ name: false, slug: false });
    }
  }, [isOpen, category]);

  // Auto-generate slug from name if creating new category
  useEffect(() => {
    if (!category && formData.name && !touched.slug) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name, category, touched.slug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === "slug") {
      setTouched((prev) => ({ ...prev, slug: true }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      toast.error("Please fill in all required fields");
      return;
    }
    await onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            {category ? <>Edit Category</> : <>Add New Category</>}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Field */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-2">
              <Type size={14} /> Category Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Plumbing"
              className="w-full text-base p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] outline-none transition-all"
              autoFocus={!category}
            />
          </div>

          {/* Slug Field */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-2">
              <LinkIcon size={14} /> Slug URL
            </label>
            <div className="relative">
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="e.g. plumbing"
                className="w-full p-3 pl-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] outline-none transition-all font-mono text-sm text-gray-600"
              />
            </div>
          </div>

          {/* Status Toggle (Only for edit usually, but can be for create too) */}
          <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity
                size={18}
                className={
                  formData.isActive ? "text-emerald-600" : "text-gray-400"
                }
              />
              <span className="text-sm font-medium text-gray-700">
                Active Status
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B4332]"></div>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-[#1B4332] text-white rounded-lg text-sm font-bold hover:bg-[#143326] transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {category ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
};
