"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Tag,
  Hash,
  List,
  Activity,
  Calendar,
} from "lucide-react";

import DataTable, {
  Column,
} from "@/app/components/containers/widgets/DataTable";
import { Category, CategoryInput } from "@/shared/types/categoryTypes";
import {
  getAllCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  toggleCategoryStatusAction,
} from "@/app/actions/admin/category-actions";
import { CategoryModal } from "./CategoryModal";
import toast from "react-hot-toast";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await getAllCategoriesAction();

      if (!res.success) {
        throw new Error(res.message);
      }

      setCategories(res.payload);
    } catch (error: any) {
      toast.error(error.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSave = async () => {};

  const handleToggleStatus = async (category: Category) => {
    const previous = category;

    // Optimistic update
    setCategories((prev) =>
      prev.map((c) =>
        c.id === category.id ? { ...c, isActive: !c.isActive } : c,
      ),
    );

    try {
      const res = await toggleCategoryStatusAction(category.id);

      if (!res.success) {
        throw new Error(res.message);
      }

      setCategories((prev) =>
        prev.map((c) => (c.id === res.payload.id ? res.payload : c)),
      );

      toast.success(
        `Category ${res.payload.isActive ? "activated" : "blocked"} successfully`,
      );
    } catch (error: any) {
      setCategories((prev) =>
        prev.map((c) => (c.id === previous.id ? previous : c)),
      );

      toast.error(error.message || "Failed to update category status");
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Stats
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.isActive).length;
  const inactiveCategories = totalCategories - activeCategories;

  // Columns
  const columns: Column<Category>[] = [
    {
      header: "Category Name",
      accessorKey: "name",
      className: "min-w-[200px]",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-lg border border-orange-100">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-gray-900">{row.name}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Slug",
      accessorKey: "slug",
      cell: (row) => (
        <div className="flex items-center gap-2 text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded-lg w-fit">
          <Hash size={12} className="text-gray-400" />
          {row.slug}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={row.isActive}
              onChange={() => handleToggleStatus(row)}
              className="sr-only peer"
              disabled={actionLoading}
            />
            <div
              className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${row.isActive ? "peer-checked:bg-emerald-600" : "peer-checked:bg-gray-300"}`}
            ></div>
          </label>
          <span
            className={`text-xs font-bold ${row.isActive ? "text-emerald-600" : "text-gray-400"}`}
          >
            {row.isActive ? "Active" : "Blocked"}
          </span>
        </div>
      ),
    },
    {
      header: "Last Updated",
      accessorKey: "updatedAt",
      cell: (row) => (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={14} className="text-gray-400" />
          {new Date(row.updatedAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: "",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(row);
            }}
            className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
              row.isActive
                ? "text-gray-500 hover:text-red-600"
                : "text-red-500 hover:text-emerald-600"
            }`}
            title={row.isActive ? "Block" : "Unblock"}
          >
            {row.isActive ? <Trash2 size={16} /> : <CheckCircle size={16} />}
          </button>
        </div>
      ),
    },
  ];

  const StatCard = ({ title, value, icon: Icon, color, iconColor }: any) => (
    <div
      className={`p-6 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100 bg-white`}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-black text-gray-900">{value}</h3>
      </div>
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 ${iconColor}`}
      >
        <Icon size={28} />
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <StatCard
          title="Total Categories"
          value={totalCategories}
          icon={List}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Active Categories"
          value={activeCategories}
          icon={Activity}
          iconColor="text-emerald-500"
        />
        <StatCard
          title="Inactive Categories"
          value={inactiveCategories}
          icon={XCircle}
          iconColor="text-red-500"
        />
      </div>

      <div className="h-[650px] bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col">
        <DataTable<Category>
          title="Categories"
          columns={columns}
          data={filteredCategories}
          isLoading={loading}
          searchPlaceholder="Search categories..."
          actions={
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white rounded-xl text-sm font-bold hover:bg-[#143326] transition-colors shadow-lg shadow-[#1B4332]/20 active:scale-95"
            >
              <Plus size={18} /> Add Category
            </button>
          }
        />
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        category={selectedCategory}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default CategoriesPage;
