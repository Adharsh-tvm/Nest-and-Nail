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
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/app/components/ui/Pagination";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [actionLoading, setActionLoading] = useState(false);

  // Derive state from URL
  const searchQuery = searchParams.get("search") || "";
  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc";
  const itemsPerPage = 8;

  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`?${params.toString()}`);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await getAllCategoriesAction({
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        sortOrder,
      });

      if (!res.success) {
        throw new Error(res.message);
      }

      setCategories(res.payload.categories);
      setTotalCount(res.payload.total);
      setActiveCount(res.payload.activeCount);
      setInactiveCount(res.payload.inactiveCount);
    } catch (error: any) {
      toast.error(error.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [searchQuery, currentPage, sortBy, sortOrder]);

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSave = async (data: CategoryInput) => {
    setActionLoading(true);

    try {
      if (selectedCategory) {
        const res = await updateCategoryAction(selectedCategory.id, data);

        if (!res.success) {
          toast.error(res.message);
          return;
        }

        toast.success(`Category ${selectedCategory ? "updated" : "created"} successfully`);
        fetchCategories();
      }

      setIsModalOpen(false);
      setSelectedCategory(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      const res = await toggleCategoryStatusAction(category.id);

      if (!res.success) {
        throw new Error(res.message);
      }

      toast.success(
        `Category ${res.payload!.isActive ? "activated" : "blocked"} successfully`,
      );
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to update category status");
    }
  };

  const handleSort = (key: string, order: "asc" | "desc") => {
    updateParams({ sortBy: key, sortOrder: order, page: "1" });
  };

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        updateParams({ search: localSearch || null, page: "1" });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch]);

  // Stats
  const totalCategories = totalCount;
  const activeCategories = activeCount;
  const inactiveCategories = inactiveCount;

  // Columns
  const columns: Column<Category>[] = [
    {
      header: "Category Name",
      accessorKey: "name",
      sortable: true,
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
      sortable: true,
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
      sortable: true,
      sortKey: "isActive",
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
          {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "N/A"}
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
            className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${row.isActive
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
          data={categories}
          isLoading={loading}
          searchPlaceholder="Search categories..."
          searchValue={localSearch}
          onSearchChange={setLocalSearch}
          page={currentPage}
          totalPages={Math.ceil(totalCount / itemsPerPage)}
          onPageChange={(page) => updateParams({ page: page.toString() })}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
          total={totalCount}
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
