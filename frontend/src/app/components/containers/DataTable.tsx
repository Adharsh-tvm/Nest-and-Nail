"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";

export type Column<T = any> = {
  header: React.ReactNode;
  accessorKey?: string;           // key in the row object (optional if using custom cell)
  className?: string;
  cell?: (row: T) => React.ReactNode;
};

export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  title?: string;
  actions?: React.ReactNode;
  searchPlaceholder?: string;
  isLoading?: boolean;
}

const DataTable = <T,>({
  columns,
  data,
  onRowClick,
  title,
  actions,
  searchPlaceholder = "Search...",
  isLoading = false,
}: DataTableProps<T>) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header Toolbar */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white z-10">
        <div>
          {title && (
            <h3 className="font-bold text-[#1B4332] text-lg">{title}</h3>
          )}
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-gray-50/50 focus:bg-white"
            />
          </div>

          {/* Filter Button */}
          <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors">
            <Filter size={18} />
          </button>

          {/* Extra Actions */}
          {actions}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1 min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider font-bold">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-3 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              // Loading Skeleton
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data && data.length > 0 ? (
              // Data Rows
              data.map((row: any, rowIndex: number) => (
                <tr
                  key={row.id || row.user_id || rowIndex}
                  onClick={(e) => {
                    // Prevent row click if clicking on action menu
                    if (
                      (e.target as HTMLElement).closest(".action-menu-trigger") ||
                      (e.target as HTMLElement).closest(".action-menu-content")
                    )
                      return;
                    onRowClick && onRowClick(row);
                  }}
                  className={`group transition-colors ${
                    onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                  }`}
                >
                  {columns.map((col, colIndex) => {
                    const value =
                      col.accessorKey !== undefined
                        ? row[col.accessorKey]
                        : undefined;

                    return (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 text-sm text-gray-600 ${
                          col.className || ""
                        }`}
                      >
                        {col.cell ? col.cell(row) : value ?? "—"}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Simple Footer Pagination */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white z-10">
        <span>Showing {data ? data.length : 0} results</span>
        <div className="flex gap-2">
          <button
            className="p-1.5 border border-gray-200 rounded-lg hover:border-[#1B4332] disabled:opacity-50"
            disabled
          >
            <ChevronLeft size={16} />
          </button>
          <button className="p-1.5 border border-gray-200 rounded-lg hover:border-[#1B4332]">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
