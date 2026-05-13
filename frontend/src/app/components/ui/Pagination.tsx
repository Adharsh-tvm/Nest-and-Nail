"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={clsx("flex items-center justify-center gap-1.5 mt-8", className)}>
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:border-emerald-400 hover:text-emerald-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {/* Page numbers */}
      {getPages().map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-400 text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={clsx(
              "w-9 h-9 rounded-xl text-sm font-semibold transition-all shadow-sm border",
              currentPage === page
                ? "bg-emerald-600 text-white border-emerald-600 shadow-emerald-200"
                : "bg-white text-gray-700 border-gray-200 hover:border-emerald-400 hover:text-emerald-700"
            )}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:border-emerald-400 hover:text-emerald-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
