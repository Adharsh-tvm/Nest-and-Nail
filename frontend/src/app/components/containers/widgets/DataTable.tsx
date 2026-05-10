"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";

export type Column<T = unknown> = {
  header: React.ReactNode;
  accessorKey?: string;
  className?: string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  sortKey?: string;
};

export interface DataTableProps<T = unknown> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  title?: string;
  actions?: React.ReactNode;
  searchPlaceholder?: string;
  isLoading?: boolean;
  // New props for remote data
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, order: "asc" | "desc") => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onFilterClick?: () => void;
  total?: number;
}

const DataTable = <T,>({
  columns,
  data,
  onRowClick,
  title,
  actions,
  searchPlaceholder = "Search...",
  isLoading = false,
  searchValue,
  onSearchChange,
  page = 1,
  totalPages = 1,
  onPageChange,
  onSort,
  sortBy,
  sortOrder,
  onFilterClick,
  total,
}: DataTableProps<T>) => {
  // Use internal state if no controlled props provided
  const [internalSearch, setInternalSearch] = React.useState("");
  const isControlled = onSearchChange !== undefined;
  const currentSearch = isControlled ? searchValue : internalSearch;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isControlled) {
      onSearchChange?.(e.target.value);
    } else {
      setInternalSearch(e.target.value);
    }
  };

  const handleSort = (col: Column<T>) => {
    if (!col.sortable || !onSort) return;
    const key = col.sortKey || col.accessorKey;
    if (!key) return;

    if (sortBy === key) {
      onSort(key, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSort(key, "asc");
    }
  };

  const renderPagination = () => {
    const pages = [];
    // Always show first, last, current, and neighbors
    const range = 2; // Neighbors on each side

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - range && i <= page + range)
      ) {
        pages.push(i);
      } else if (
        (i === page - range - 1 && i > 1) ||
        (i === page + range + 1 && i < totalPages)
      ) {
        pages.push("...");
      }
    }

    // Deduplicate ellipses
    const uniquePages = pages.filter((val, index, arr) => val !== "..." || arr[index - 1] !== "...");

    return uniquePages.map((p, idx) => {
      if (p === "...") {
        return (
          <span key={`ellipsis-${idx}`} className="text-gray-300 px-2">...</span>
        );
      }

      const pageNum = p as number;
      const isActive = pageNum === page;

      return (
        <button
          key={pageNum}
          onClick={() => onPageChange?.(pageNum)}
          disabled={!onPageChange}
          className={`w-8 h-8 flex items-center justify-center rounded-lg shadow-sm font-bold transition-all ${isActive
              ? "bg-[#1B4332] text-white"
              : "hover:bg-gray-50 text-gray-600 font-medium"
            }`}
        >
          {pageNum}
        </button>
      );
    });
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden relative">
      {/* Decorative gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1B4332] via-[#40916C] to-[#1B4332] opacity-50" />

      {/* Header Toolbar */}
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white z-10 sticky top-0">
        <div>
          {title && (
            <h3 className="font-black text-[#1B4332] text-2xl tracking-tight">
              {title}
            </h3>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-72 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#1B4332] transition-colors" />
            </div>
            <input
              type="text"
              value={currentSearch || ""}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-gray-100 bg-gray-50/50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/10 focus:border-[#1B4332]/20 focus:bg-white transition-all shadow-sm"
            />
          </div>

          {/* Filter Button */}
          {onFilterClick && (
            <button
              onClick={onFilterClick}
              className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-[#1B4332] transition-colors shadow-sm active:scale-95"
            >
              <Filter size={20} />
            </button>
          )}

          {/* Extra Actions */}
          {actions}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1 px-4 md:px-8 pb-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider first:pl-2 ${col.className || ""
                    }`}
                >
                  <div
                    onClick={() => handleSort(col)}
                    className={`flex items-center gap-2 group ${col.sortable ? "cursor-pointer hover:text-gray-600" : ""}`}
                  >
                    {col.header}
                    {col.sortable && (
                      <ArrowUpDown
                        size={12}
                        className={`transition-all ${sortBy === (col.sortKey || col.accessorKey)
                          ? "opacity-100 text-[#1B4332] scale-110"
                          : "opacity-0 group-hover:opacity-40"
                          } ${sortBy === (col.sortKey || col.accessorKey) && sortOrder === "desc" ? "rotate-180" : ""}`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              // Loading Skeleton
              [...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-6">
                      <div className="h-2.5 bg-gray-100 rounded-full w-2/3 mb-2"></div>
                      {j === 0 && (
                        <div className="h-2 bg-gray-50 rounded-full w-1/2"></div>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : data && data.length > 0 ? (
              // Data Rows
              data.map((row: T, rowIndex: number) => (
                <tr
                  key={(row as { id?: string | number }).id || (row as { user_id?: string | number }).user_id || rowIndex}
                  onClick={(e) => {
                    // Prevent row click if clicking on action menu or interactive elements
                    if (
                      (e.target as HTMLElement).closest(
                        ".action-menu-trigger"
                      ) ||
                      (e.target as HTMLElement).closest("button") ||
                      (e.target as HTMLElement).closest("a")
                    )
                      return;
                    if (onRowClick) {
                      onRowClick(row);
                    }
                  }}
                  className={`group transition-all duration-200 hover:bg-emerald-50/30 ${onRowClick
                      ? "cursor-pointer hover:transform hover:scale-[1.01]"
                      : ""
                    }`}
                >
                  {columns.map((col, colIndex) => {
                    const value =
                      col.accessorKey !== undefined
                        ? (row as Record<string, unknown>)[col.accessorKey]
                        : undefined;

                    return (
                      <td
                        key={colIndex}
                        className={`px-6 py-5 text-sm text-gray-600 first:pl-2 first:rounded-l-2xl last:rounded-r-2xl ${col.className || ""
                          }`}
                      >
                        {col.cell ? col.cell(row) : (value as React.ReactNode) ?? "—"}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Search className="text-gray-300 w-8 h-8" />
                    </div>
                    <h4 className="text-gray-900 font-bold mb-1">
                      No records found
                    </h4>
                    <p className="text-gray-500 text-sm">
                      Try adjusting your search or filters.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      <div className="p-6 md:p-8 flex items-center justify-between text-xs text-gray-500 bg-white border-t border-gray-50">
        <div className="flex items-center gap-2">
          <span className="font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
            {total !== undefined ? total : (data ? data.length : 0)}
          </span>
          <span>records {total !== undefined ? "total" : "showing"}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange?.(page - 1)}
            disabled={page <= 1 || !onPageChange}
            className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded-lg hover:bg-gray-50 hover:border-gray-200 disabled:opacity-50 disabled:hover:bg-white transition-colors text-gray-600"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1 mx-2">
            {renderPagination()}
          </div>

          <button
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= totalPages || !onPageChange}
            className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded-lg hover:bg-gray-50 hover:border-gray-200 disabled:opacity-50 disabled:hover:bg-white transition-colors text-gray-600"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
